import { Routes, Services } from "@/shared/constants"
import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    NotImplementedException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from "@nestjs/common"
import { ClubsService } from "./clubs.service"
import { PostClubDto } from "./dtos/PostClub.dto"
import { JwtAuthGuard } from "@/auth/utils/guards"
import { AuthenticatedUser } from "@/shared/utils/decorators"
import { AuthUserPayload } from "@/shared/utils/types"
import { PatchClubDto } from "./dtos/PatchClub.dto"

@Controller(Routes.CLUBS)
export class ClubsController {
    constructor(
        @Inject(Services.CLUB_SERVICE)
        private readonly clubService: ClubsService
    ) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(
        @Body() createClubDto: PostClubDto,
        @AuthenticatedUser() authUser: AuthUserPayload
    ) {
        return this.clubService.create(createClubDto, authUser)
    }

    @Get()
    async getAllClubs(
        @Query("start") start: number,
        @Query("count") count: number
    ) {
        return this.clubService.findAll({
            start,
            count,
        })
    }

    @Get(":clubId")
    async getById(@Param("clubId", ParseIntPipe) clubId: number) {
        return this.clubService.findById(clubId)
    }

    @Patch(":clubId")
    async updateClub(
        @Param("clubId", ParseIntPipe) clubId: number,
        @Body() dto: PatchClubDto
    ) {
        const { name, description, queue, currentDJ, playlists } = dto
        const updateData = {}
        if (name) {
            updateData["name"] = name
        }
    }

    @Delete(":clubId")
    async delete(@Param("clubId", ParseIntPipe) clubId: number) {
        return this.clubService.delete(clubId)
    }
}
