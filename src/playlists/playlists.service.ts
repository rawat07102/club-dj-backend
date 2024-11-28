import { Club, Playlist, User } from "@/shared/entities"
import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { IPlaylistService } from "./interfaces/IPlaylistService.interface"
import { AuthUserPayload, Buckets } from "@/shared/utils/types"
import { ImagesService } from "@/images.service"
import * as path from "path"
import { UpdatePlaylistDto } from "./dtos/update-playlist.dto"

@Injectable()
export class PlaylistsService implements IPlaylistService {
    constructor(
        @InjectRepository(Playlist)
        private readonly playlistRepo: Repository<Playlist>,

        @Inject()
        private imageService: ImagesService
    ) {}

    async findAll(): Promise<Playlist[]> {
        return this.playlistRepo.find({})
    }

    async create(name: string, authUser: AuthUserPayload): Promise<Playlist> {
        const newPlaylist = this.playlistRepo.create({
            name,
        })

        await this.playlistRepo
            .createQueryBuilder()
            .relation(User, "playlists")
            .of(authUser.id)
            .add(newPlaylist.id)
        newPlaylist.creatorId = authUser.id
        await newPlaylist.save()
        return newPlaylist
    }

    async findById(id: Playlist["id"]): Promise<Playlist> {
        return this.playlistRepo.findOne({
            where: { id },
            relations: {
                creator: true,
            },
            select: {
                creator: {
                    username: true,
                    profilePic: true,
                    bio: true,
                },
            },
        })
    }

    async updatePlaylistDetails(
        id: Playlist["id"],
        dto: UpdatePlaylistDto,
        authUser: AuthUserPayload
    ): Promise<Playlist> {
        const { name, description } = dto
        const playlist = await this.playlistRepo.findOne({
            relations: {
                creator: true,
            },
            where: {
                id,
            },
        })
        if (!playlist || playlist.creator.id !== authUser.id) {
            throw new UnauthorizedException("User is not authorized")
        }
        if (name) {
            playlist.name = name
        }
        if (description) {
            playlist.description = description
        }
        await playlist.save()
        return playlist
    }

    async changePlaylistThumbnail(
        id: Playlist["id"],
        file: Express.Multer.File,
        authUser: AuthUserPayload
    ): Promise<Club["thumbnail"]> {
        const playlist = await this.playlistRepo.findOneBy({
            id,
            creatorId: authUser.id,
        })
        if (!playlist) {
            throw new BadRequestException("Playlist not found")
        }

        if (playlist.thumbnail) {
            await this.imageService.deleteFile(playlist.thumbnail)
        }

        const imageUrl = await this.imageService.uploadFile(
            file,
            Buckets.PLAYLISTS,
            this.imageService.createFileName(
                id,
                path.extname(file.originalname)
            )
        )
        playlist.thumbnail = imageUrl
        await playlist.save()
        return playlist.thumbnail
    }

    async addVideoToPlaylist(
        id: Playlist["id"],
        videoId: string,
        authUser: AuthUserPayload
    ): Promise<void> {
        const playlist = await this.playlistRepo.findOneBy({
            id,
        })

        if (playlist.creatorId !== authUser.id) {
            throw new UnauthorizedException(
                "Only playlist creator can make changes to the playlist."
            )
        }

        if (playlist.list) {
            if (playlist.list.includes(videoId)) {
                throw new ConflictException("Video already in queue")
            }
            playlist.list.push(videoId)
        } else {
            playlist.list = [videoId]
        }

        await playlist.save()
    }

    async removeVideoFromPlaylist(
        id: Playlist["id"],
        videoId: string,
        authUser: AuthUserPayload
    ): Promise<void> {
        const playlist = await this.playlistRepo.findOne({
            where: { id },
        })
        if (playlist.creatorId !== authUser.id) {
            throw new UnauthorizedException(
                "Only playlist creator can make changes to the playlist."
            )
        }
        playlist.list = playlist.list.filter((id) => id !== videoId)
        await playlist.save()
    }

    async delete(id: Playlist["id"]): Promise<void> {
        const playlist = await this.playlistRepo.findOneBy({ id })
        if (playlist.thumbnail) {
            await this.imageService.deleteFile(playlist.thumbnail)
        }
        await playlist.remove()
    }

    async isCreator(id: Playlist["id"], userId: User["id"]): Promise<boolean> {
        const playlist = await this.playlistRepo.findOne({
            where: {
                id,
            },
        })

        return playlist.creatorId === userId
    }
}
