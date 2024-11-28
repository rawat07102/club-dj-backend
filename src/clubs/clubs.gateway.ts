import { IAuthService } from "@/auth/interfaces/IAuthService.interface"
import { Services } from "@/shared/constants"
import { AuthUserPayload } from "@/shared/utils/types"
import { forwardRef, Inject, UnauthorizedException } from "@nestjs/common"
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { Club } from "@/shared/entities"
import { PlayerPayload } from "./dtos/player-payload"
import { instanceToPlain } from "class-transformer"
import { IClubService } from "./interfaces/IClubService.interface"

type SocketWithAuth = Socket<
    {},
    {},
    {},
    {
        authUser?: AuthUserPayload
        voteSkip?: boolean
    }
>

@WebSocketGateway({
    cors: {
        origin: "*",
    },
})
export class ClubsGateway implements OnGatewayConnection {
    constructor(
        @Inject(Services.AUTH_SERVICE)
        private authService: IAuthService,

        @Inject(forwardRef(() => Services.CLUB_SERVICE))
        private clubService: IClubService
    ) {}
    @WebSocketServer() server: Server

    async handleConnection(
        @ConnectedSocket()
        client: SocketWithAuth
    ) {
        try {
            const accessToken = client.handshake.auth.accessToken
            if (!accessToken) {
                throw new UnauthorizedException("No token found")
            }
            const isValid = await this.authService.verifyToken(accessToken)
            if (!isValid) {
                throw new Error("Token verification failed...")
            }
            const { id, username, profilePic } =
                await this.authService.getUserByAuthToken(accessToken)
            client.data.authUser = { id, username, profilePic }
            return `${client.data.authUser.username} connected succesfully...`
        } catch (err) {
            client.disconnect()
            throw new UnauthorizedException(err.message)
        }
    }

    @SubscribeMessage("message")
    handleMessage(
        @MessageBody()
        data: {
            message: string
            clubId: Club["id"]
        },
        @ConnectedSocket() client: Socket
    ) {
        const authUser = client.data.authUser
        this.server.to(data.clubId.toString()).emit("new-message", {
            user: authUser,
            message: data.message,
        })
    }

    @SubscribeMessage("join-room")
    async joinRoom(
        @MessageBody() clubId: Club["id"],
        @ConnectedSocket() client: Socket
    ): Promise<PlayerPayload> {
        await client.join(clubId.toString())
        return this.clubService.getPlayerPayload(clubId)
    }

    @SubscribeMessage("leave-room")
    leaveRoom(
        @MessageBody() clubId: Club["id"],
        @ConnectedSocket() client: Socket
    ) {
        client.leave(clubId.toString())
        return `Left club with id ${clubId}`
    }

    getJoinedUsers(clubId: Club["id"]): number {
        return this.server.sockets.adapter.rooms.get(clubId.toString()).size
    }

    emitPlayNext(clubId: Club["id"], payload: PlayerPayload) {
        const { id, currentVideo, voteSkipCount, currentVideoStartTime } =
            payload
        return this.server.in(clubId.toString()).emit("play-next", {
            id,
            currentVideo,
            voteSkipCount,
            currentVideoStartTime,
        })
    }
}
