import { Club, Playlist, User } from "@/shared/entities"
import { Inject, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { IPlaylistService } from "./interfaces/IPlaylistService.interface"
import { CreatePlaylistDto } from "./dtos/create-playlist.dto"
import { Services } from "@/shared/constants"
import { IUserService } from "@/user/interfaces/IUserService.interface"
import { AuthUserPayload } from "@/shared/utils/types"
import { IClubService } from "@/clubs/interfaces/IClubService.interface"

@Injectable()
export class PlaylistsService implements IPlaylistService {
    constructor(
        @InjectRepository(Playlist)
        private readonly playlistRepo: Repository<Playlist>,

        @Inject(Services.USER_SERVICE)
        private readonly userService: IUserService,

        @Inject(Services.CLUB_SERVICE)
        private readonly clubService: IClubService,
    ) {}

    async create(
        dto: CreatePlaylistDto,
        authUser: AuthUserPayload,
    ): Promise<Playlist> {
        const newPlaylist = this.playlistRepo.create(dto)
        const user = await this.userService.findById(authUser.id)
        if (!user.playlists) {
            user.playlists = [newPlaylist]
        } else {
            user.playlists.push(newPlaylist)
        }
        newPlaylist.creator = user
        await newPlaylist.save()
        return newPlaylist
    }

    async findById(id: Playlist["id"]): Promise<Playlist> {
        return this.playlistRepo.findOneBy({ id })
    }
}
