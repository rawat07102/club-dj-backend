import { IAuthService } from "@/auth/interfaces/IAuthService.interface"
import { JwtAuthGuard } from "@/auth/utils/guards"
import { Services } from "@/shared/constants"
import { AuthenticatedUser } from "@/shared/utils/decorators"
import { AuthUserPayload } from "@/shared/utils/types"
import { Inject, UnauthorizedException, UseGuards } from "@nestjs/common"
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets"
import { Server, Socket } from "socket.io"

@WebSocketGateway()
export class ClubsGateway implements OnGatewayConnection {
    constructor(
        @Inject(Services.AUTH_SERVICE)
        private authService: IAuthService
    ) {}
    @WebSocketServer() server: Server

    async handleConnection(
        @ConnectedSocket()
        client: Socket<
            {},
            {},
            {},
            {
                authUser: AuthUserPayload
            }
        >
    ) {
        try {
            const accessToken = client.handshake.auth.accessToken.split(" ")[1]
            const isValid = await this.authService.verifyToken(accessToken)
            if (!isValid) {
                throw new Error("Token verification failed...")
            }
            const authUser =
                await this.authService.getUserByAuthToken(accessToken)
            client.data.authUser = authUser
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
            clubId: string
        },
        @ConnectedSocket() client: Socket
    ) {
        const authUser = client.data.authUser
        client.to(data.clubId).emit("new-message", {
            user: authUser,
            message: data.message,
        })
    }

    @SubscribeMessage("join-room")
    joinRoom(@MessageBody() clubId: string, @ConnectedSocket() client: Socket) {
        client.join(clubId)
        return `Joined club with id ${clubId}`
    }

    @SubscribeMessage("leave-room")
    leaveRoom(
        @MessageBody() clubId: string,
        @ConnectedSocket() client: Socket
    ) {
        client.leave(clubId)
        return `Left club with id ${clubId}`
    }
}
