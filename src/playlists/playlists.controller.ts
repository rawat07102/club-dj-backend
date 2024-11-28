import { JwtAuthGuard } from "@/auth/utils/guards"
import { Routes, Services } from "@/shared/constants"
import { AuthenticatedUser } from "@/shared/utils/decorators"
import { AuthUserPayload } from "@/shared/utils/types"
import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    ParseIntPipe,
    Patch,
    Put,
    UnauthorizedException,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common"
import { IPlaylistService } from "./interfaces/IPlaylistService.interface"
import { FileInterceptor } from "@nestjs/platform-express"
import { UpdatePlaylistDto } from "./dtos/update-playlist.dto"

@Controller(Routes.PLAYLISTS)
export class PlaylistsController {
    constructor(
        @Inject(Services.PLAYLISTS_SERVICE)
        private readonly playlistService: IPlaylistService
    ) {}

    @Get()
    async getAll() {
        return this.playlistService.findAll()
    }

    @Get(":playlistId")
    async getPlaylistById(
        @Param("playlistId", ParseIntPipe) playlistId: number
    ) {
        return this.playlistService.findById(playlistId)
    }

    @Put(":playlistId/thumbnail")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor("thumbnail"))
    async changeThumbnail(
        @Param("playlistId", ParseIntPipe) playlistId: number,
        @AuthenticatedUser() authUser: AuthUserPayload,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.playlistService.changePlaylistThumbnail(
            playlistId,
            file,
            authUser
        )
    }

    @Patch(":playlistId")
    @UseGuards(JwtAuthGuard)
    async updatePlaylistDetails(
        @Param("playlistId", ParseIntPipe) playlistId: number,
        @Body() dto: UpdatePlaylistDto,
        @AuthenticatedUser() authUser: AuthUserPayload
    ) {
        return this.playlistService.updatePlaylistDetails(
            playlistId,
            dto,
            authUser
        )
    }

    @Put(":playlistId/list")
    @UseGuards(JwtAuthGuard)
    async addVideoToPlaylist(
        @Param("playlistId", ParseIntPipe) playlistId: number,
        @AuthenticatedUser() authUser: AuthUserPayload,
        @Body("videoId") videoId: string
    ) {
        return this.playlistService.addVideoToPlaylist(
            playlistId,
            videoId,
            authUser
        )
    }

    @Delete(":playlistId/list/:videoId")
    @UseGuards(JwtAuthGuard)
    async removeVideoFromPlaylist(
        @Param("playlistId", ParseIntPipe) playlistId: number,
        @Param("videoId") videoId: string,
        @AuthenticatedUser() authUser: AuthUserPayload
    ) {
        return this.playlistService.removeVideoFromPlaylist(
            playlistId,
            videoId,
            authUser
        )
    }

    @Delete(":playlistId")
    @UseGuards(JwtAuthGuard)
    async delete(
        @Param("playlistId", ParseIntPipe) playlistId: number,
        @AuthenticatedUser() authUser: AuthUserPayload
    ) {
        if (!(await this.playlistService.isCreator(playlistId, authUser.id))) {
            throw new UnauthorizedException("Operation not allowed.")
        }
        return this.playlistService.delete(playlistId)
    }
}
