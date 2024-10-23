import { Routes, Services } from "@/shared/constants"
import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    Query,
    UnauthorizedException,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common"
import { PostClubDto } from "./dtos/PostClub.dto"
import { JwtAuthGuard } from "@/auth/utils/guards"
import { AuthenticatedUser } from "@/shared/utils/decorators"
import { AuthUserPayload } from "@/shared/utils/types"
import { PatchClubDto } from "./dtos/PatchClub.dto"
import { IClubService } from "./interfaces/IClubService.interface"
import { IPlaylistService } from "@/playlists/interfaces/IPlaylistService.interface"
import { CreatePlaylistDto } from "@/playlists/dtos/create-playlist.dto"
import { FileInterceptor } from "@nestjs/platform-express"

@Controller(Routes.CLUBS)
export class ClubsController {
    constructor(
        @Inject(Services.CLUB_SERVICE)
        private readonly clubService: IClubService,

        @Inject(Services.PLAYLISTS_SERVICE)
        private readonly playlistService: IPlaylistService
    ) {}

    @Get()
    async getAllClubs(
        @Query("skip") skip: number,
        @Query("take") take: number,
        @Query("searchQuery") searchQuery: string,
    ) {
        return this.clubService.findAll({
            skip,
            take,
            searchQuery,
        })
    }

    @Get(":clubId")
    async getById(@Param("clubId", ParseIntPipe) clubId: number) {
        return this.clubService.findById(clubId)
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(
        @Body() dto: PostClubDto,
        @AuthenticatedUser() authUser: AuthUserPayload
    ) {
        return this.clubService.create(dto, authUser)
    }

    @Put(":clubId/thumbnail")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor("thumbnail"))
    async uploadClubThumbnail(
        @Param("clubId", ParseIntPipe) clubId: number,
        @UploadedFile() file: Express.Multer.File,
        @AuthenticatedUser() authUser: AuthUserPayload
    ) {
        return this.clubService.changeClubThumbnail(clubId, file, authUser)
    }

    @Delete(":clubId/thumbnail")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor("file"))
    async deleteThumbnail(
        @Param("clubId", ParseIntPipe) clubId: number,
        @AuthenticatedUser() authUser: AuthUserPayload
    ) {
        return this.clubService.deleteClubThumbnail(clubId, authUser)
    }


    @Put(":clubId/queue")
    @UseGuards(JwtAuthGuard)
    async putVideoToQueue(
        @Param("clubId", ParseIntPipe) clubId: number,
        @Body("videoId") videoId: string,
        @AuthenticatedUser() authUser: AuthUserPayload
    ) {
        return this.clubService.addVideoToQueue(clubId, videoId, authUser)
    }

    @Delete(":clubId/queue")
    @UseGuards(JwtAuthGuard)
    async deleteVideoFromQueue(
        @Param("clubId", ParseIntPipe) clubId: number,
        @Body("videoId") videoId: string,
        @AuthenticatedUser() authUser: AuthUserPayload
    ) {
        return this.clubService.removeVideoFromQueue(clubId, videoId, authUser)
    }

    @UseGuards(JwtAuthGuard)
    @Patch(":clubId")
    async updateClubDetails(
        @Param("clubId", ParseIntPipe) clubId: number,
        @Body() dto: PatchClubDto,
        @AuthenticatedUser() authUser: AuthUserPayload
    ) {
        return this.clubService.updateClubDetails(clubId, dto, authUser)
    }

    @UseGuards(JwtAuthGuard)
    @Put(":clubId/followers")
    async addUserToClubFollowers(
        @Param("clubId", ParseIntPipe) clubId: number,
        @AuthenticatedUser() authUser: AuthUserPayload
    ) {
        return this.clubService.addUserToClubFollowers(clubId, authUser.id)
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":clubId/followers")
    async removeUserFromClubFollowers(
        @Param("clubId", ParseIntPipe) clubId: number,
        @AuthenticatedUser() authUser: AuthUserPayload
    ) {
        return this.clubService.removeUserFromClubFollowers(clubId, authUser.id)
    }

    @UseGuards(JwtAuthGuard)
    @Post(":clubId/playlists")
    async createNewPlaylist(
        @Param("clubId", ParseIntPipe) clubId: number,
        @AuthenticatedUser() authUser: AuthUserPayload,
        @Body() dto: CreatePlaylistDto
    ) {
        if (!this.clubService.isCreator(clubId, authUser.id)) {
            throw new UnauthorizedException()
        }

        const newPlaylist = await this.playlistService.create(dto, authUser)
        const club = await this.clubService.findById(clubId)
        newPlaylist.club = club
        await newPlaylist.save()
        return newPlaylist
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":clubId")
    async delete(
        @Param("clubId", ParseIntPipe) clubId: number,
        @AuthenticatedUser() authUser: AuthUserPayload
    ) {
        return this.clubService.delete(clubId, authUser)
    }
}
