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
    Post,
    Put,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common"
import { IPlaylistService } from "./interfaces/IPlaylistService.interface"
import { CreatePlaylistDto } from "./dtos/create-playlist.dto"
import { FileInterceptor } from "@nestjs/platform-express"
import { Playlist } from "@/shared/entities"

@Controller(Routes.PLAYLISTS)
export class PlaylistsController {
    constructor(
        @Inject(Services.PLAYLISTS_SERVICE)
        private readonly playlistService: IPlaylistService
    ) {}

    @Get(":playlistId")
    async getPlaylistById(
        @Param("playlistId", ParseIntPipe) playlistId: number
    ) {
        return this.playlistService.findById(playlistId)
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createPlaylist(
        @Body() dto: CreatePlaylistDto,
        @AuthenticatedUser() authUser: AuthUserPayload
    ) {
        return this.playlistService.create(dto, authUser)
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
        @AuthenticatedUser() authUser: AuthUserPayload,
    ) {
        return this.playlistService.removeVideoFromPlaylist(
            playlistId,
            videoId,
            authUser
        )
    }
}
