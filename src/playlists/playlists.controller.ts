import { JwtAuthGuard } from "@/auth/utils/guards"
import { Routes, Services } from "@/shared/constants"
import { AuthenticatedUser } from "@/shared/utils/decorators"
import { AuthUserPayload } from "@/shared/utils/types"
import {
    Body,
    Controller,
    Inject,
    Param,
    ParseIntPipe,
    Patch,
    UseGuards,
} from "@nestjs/common"
import { UpdatePlaylistDto } from "./dtos/update-playlist.dto"
import { IPlaylistService } from "./interfaces/IPlaylistService.interface"

@Controller(Routes.PLAYLISTS)
export class PlaylistsController {
    constructor(
        @Inject(Services.PLAYLISTS_SERVICE)
        private readonly playlistService: IPlaylistService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Patch(":playlistId/list")
    async updatePlaylistVideoList(
        @Param("playlistId", ParseIntPipe) playlistId: number,
        @AuthenticatedUser() authUser: AuthUserPayload,
        @Body() dto: UpdatePlaylistDto
    ) {
        const playlist = await this.playlistService.searchUsersPlaylsits(
            authUser.id,
            playlistId
        )

        // 1. find playlist with id && user as creator
        // 2. figure out the operation from the ops
        // 3. update each and save at the end
    }
}
