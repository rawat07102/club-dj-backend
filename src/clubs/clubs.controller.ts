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
    Query,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common"
import { PostClubDto } from "./dtos/PostClub.dto"
import { JwtAuthGuard } from "@/auth/utils/guards"
import { AuthenticatedUser } from "@/shared/utils/decorators"
import { AuthUserPayload } from "@/shared/utils/types"
import { PatchClubDto } from "./dtos/PatchClub.dto"
import { IClubService } from "./interfaces/IClubService.interface"
import { IPlaylistService } from "@/playlists/interfaces/IPlaylistService.interface"
import { CreatePlaylistDto } from "@/playlists/dtos/create-playlist.dto"

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
        @Query("take") take: number
    ) {
        return this.clubService.findAll({
            skip,
            take,
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
    @Patch(":clubId")
    async updateClubDetails(
        @Param("clubId", ParseIntPipe) clubId: number,
        @Body() dto: PatchClubDto,
        @AuthenticatedUser() authUser: AuthUserPayload
    ) {
        return this.clubService.updateClubDetails(clubId, dto, authUser)
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
