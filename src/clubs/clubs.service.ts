import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Inject,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common"
import { IClubService } from "./interfaces/IClubService.interface"
import { Club, Genre, Playlist, User } from "@/shared/entities"
import { AuthUserPayload, Buckets, FindAllOptions } from "@/shared/utils/types"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { IUserService } from "@/user/interfaces/IUserService.interface"
import { Services } from "@/shared/constants"
import { PatchClubDto } from "./dtos/PatchClub.dto"
import { ImagesService } from "@/images.service"
import * as path from "path"
import { IGenresService } from "@/genres/interfaces/IGenresService.interface"
import { IPlaylistService } from "@/playlists/interfaces/IPlaylistService.interface"
import { SchedulerRegistry } from "@nestjs/schedule"
import { YoutubeService } from "@/youtube/youtube.service"
import { ClubsGateway } from "./clubs.gateway"
import { PlayerPayload } from "./dtos/player-payload"

@Injectable()
export class ClubsService implements IClubService {
    constructor(
        @InjectRepository(Club)
        private clubRepo: Repository<Club>,
        @Inject(Services.GENRES_SERVICE)
        private genreService: IGenresService,
        @Inject(Services.USER_SERVICE)
        private userService: IUserService,
        @Inject()
        private imageService: ImagesService,
        @Inject(Services.PLAYLISTS_SERVICE)
        private playlistService: IPlaylistService,
        @Inject()
        private scheduler: SchedulerRegistry,
        @Inject()
        private youtubeService: YoutubeService,
        @Inject()
        private clubGateway: ClubsGateway
    ) {}

    async addPlaylistToClub(clubId: Club["id"], authUser: AuthUserPayload) {
        const club = await this.clubRepo.findOne({
            where: { id: clubId },
            relations: {
                playlists: true,
            },
        })
        console.log(club.playlists)
        const newPlaylist = await this.playlistService.create(
            `Playlist #${(club.playlists.length || 0) + 1}`,
            authUser
        )
        await this.clubRepo
            .createQueryBuilder()
            .relation(Club, "playlists")
            .of(clubId)
            .add(newPlaylist.id)
        console.log(newPlaylist)

        return newPlaylist.id
    }

    async removePlaylistFromClub(
        clubId: Club["id"],
        playlistId: Playlist["id"]
    ) {
        return this.clubRepo
            .createQueryBuilder()
            .relation(Club, "playlists")
            .of(clubId)
            .remove(playlistId)
    }

    async changeClubThumbnail(
        id: Club["id"],
        file: Express.Multer.File,
        authUser: AuthUserPayload
    ): Promise<Club["thumbnail"]> {
        const club = await this.clubRepo.findOneBy({
            id,
            creatorId: authUser.id,
        })
        if (!club) {
            throw new BadRequestException("Club not found")
        }

        if (club.thumbnail) {
            await this.imageService.deleteFile(club.thumbnail)
        }

        const imageUrl = await this.imageService.uploadFile(
            file,
            Buckets.CLUBS,
            this.imageService.createFileName(
                id,
                path.extname(file.originalname)
            )
        )
        club.thumbnail = imageUrl
        await club.save()
        return club.thumbnail
    }

    async deleteClubThumbnail(id: Club["id"]) {
        const club = await this.clubRepo.findOneBy({ id })
        if (!club) {
            throw new BadRequestException("User not found")
        }

        if (!club.thumbnail) {
            return
        }

        await this.imageService.deleteFile(club.thumbnail)
        club.thumbnail = null
        await club.save()
    }

    async addUserToClubFollowers(
        id: Club["id"],
        userId: User["id"]
    ): Promise<void> {
        return this.clubRepo
            .createQueryBuilder()
            .relation(Club, "followers")
            .of(id)
            .add(userId)
    }

    removeUserFromClubFollowers(
        id: Club["id"],
        userId: User["id"]
    ): Promise<void> {
        return this.clubRepo
            .createQueryBuilder()
            .relation(Club, "followers")
            .of(id)
            .remove(userId)
    }

    async addVideoToQueue(
        id: Club["id"],
        videoId: string,
        authUser: AuthUserPayload
    ): Promise<Club> {
        const user = await this.userService.findById(authUser.id)
        const club = await this.clubRepo.findOne({
            where: { id },
        })

        if (user.lastQueued && club.timeBeforeNextQueue) {
            const timeSinceLastQueued = Date.now() - user.lastQueued.getTime()
            const timeRemaining =
                (timeSinceLastQueued - club.timeBeforeNextQueue) / 1000
            if (timeRemaining > 2) {
                throw new ForbiddenException(
                    `Please wait ${timeRemaining} seconds before trying to update queue.`
                )
            }
        }

        if (!club.currentVideo) {
            // play this video if not playing a video currently
            club.currentVideo = videoId
            club.currentVideoStartTime = new Date()
            club.votes = null
            club.voteSkipCount = 0
            this.clubGateway.emitPlayNext(club.id, club)
            this.createVideoEndTimeout(
                club.id,
                videoId,
                club.currentVideoStartTime
            )
            await club.save()
            return club
        }

        if (!club.queue || club.queue.length === 0) {
            // if currentVideo is playing but empty queue
            // add this video to the queue
            club.queue = [videoId]
            user.lastQueued = new Date()
            await club.save()
            await user.save()
            return club
        }

        if (club.queue.includes(videoId)) {
            throw new ConflictException("Video already in queue")
        }
        club.queue.push(videoId)
        user.lastQueued = new Date()
        await club.save()
        await user.save()
        return club
    }

    async removeVideoFromQueue(
        id: Club["id"],
        videoId: string,
        authUser: AuthUserPayload
    ): Promise<Club> {
        const club = await this.clubRepo.findOne({
            where: { id },
        })
        if (club.creatorId !== authUser.id) {
            throw new UnauthorizedException(
                "Only club owner can make changes to the queue."
            )
        }
        club.queue = club.queue.filter((id) => id !== videoId)
        await club.save()
        return club
    }

    async addUserToDjWishlist(
        id: Club["id"],
        userId: User["id"],
        authUser: AuthUserPayload
    ): Promise<Club["djWishlist"]> {
        const club = await this.clubRepo.findOneByOrFail({ id })
        if (club.creator.id !== authUser.id) {
            throw new UnauthorizedException(
                "Only club owner can make changes to the djWishlist."
            )
        }
        const user = await this.userService.findById(userId)
        club.djWishlist.push(user)
        await club.save()
        return club.djWishlist
    }

    async removeUserFromDjWishlist(
        id: Club["id"],
        userId: User["id"],
        authUser: AuthUserPayload
    ): Promise<Club["djWishlist"]> {
        const club = await this.clubRepo.findOneByOrFail({ id })
        if (club.creator.id !== authUser.id) {
            throw new UnauthorizedException(
                "Only club owner can make changes to the djWishlist."
            )
        }
        club.djWishlist = club.djWishlist.filter(({ id }) => id !== userId)
        await club.save()
        return club.djWishlist
    }

    async setCurrentDj(
        id: Club["id"],
        userId: User["id"]
    ): Promise<Club["currentDJ"]> {
        const club = await this.clubRepo.findOneByOrFail({ id })
        const user = await this.userService.findById(userId)
        club.currentDJ = user
        await club.save()
        return club.currentDJ
    }

    async create(authUser: AuthUserPayload): Promise<Club["id"]> {
        const user = await this.userService.findById(authUser.id)
        const newClub = this.clubRepo.create({
            name: `Club #${user.clubs.length + 1}`,
            description: "",
        })
        newClub.queue = []
        user.clubs.push(newClub)
        await user.save()
        return newClub.id
    }

    async findAll({
        skip = 0,
        take = 10,
        searchQuery,
    }: FindAllOptions): Promise<Club[]> {
        let query = this.clubRepo
            .createQueryBuilder("club")
            .take(take)
            .skip(skip)

        if (searchQuery) {
            query = query
                .addSelect("similarity(name, :searchQuery)", "score")
                .where("similarity(name, :searchQuery) > 0.1")
                .setParameter("searchQuery", searchQuery)
                .orderBy("score", "DESC")
        }

        return query.getMany()
    }

    async findById(id: Club["id"]): Promise<Club> {
        return this.clubRepo.findOne({
            where: {
                id,
            },
            relations: {
                creator: true,
                currentDJ: true,
                followers: true,
                playlists: true,
                djWishlist: true,
                genres: true,
            },
        })
    }

    async delete(id: Club["id"]): Promise<boolean> {
        const club = await this.clubRepo.findOneBy({ id })
        if (club.thumbnail) {
            await this.imageService.deleteFile(club.thumbnail)
        }
        await club.remove()
        return true
    }

    async updateClubDetails(
        id: Club["id"],
        dto: PatchClubDto,
        authUser: AuthUserPayload
    ): Promise<Club> {
        const { name, description, genreIds } = dto
        const club = await this.clubRepo.findOne({
            relations: {
                creator: true,
            },
            where: {
                id,
            },
        })
        if (!club || club.creator.id !== authUser.id) {
            throw new UnauthorizedException("User is not authorized")
        }
        if (name) {
            club.name = name
        }
        if (description) {
            club.description = description
        }
        if (genreIds) {
            let genres: Genre[] = []
            if (genreIds.length > 0) {
                genres = await this.genreService.findbyIds(genreIds)
            }
            club.genres = genres
        }
        await club.save()
        return club
    }

    async isCreator(clubId: Club["id"], userId: User["id"]): Promise<boolean> {
        const club = await this.clubRepo.findOne({
            where: {
                id: clubId,
            },
            relations: {
                creator: true,
            },
        })

        return club.creator.id === userId
    }

    async playNextVideo(id: Club["id"]): Promise<PlayerPayload> {
        const club = await this.clubRepo.findOne({
            where: { id },
            select: {
                id: true,
                currentVideo: true,
                currentVideoStartTime: true,
                queue: true,
                votes: true,
                voteSkipCount: true,
            },
        })

        // No more videos to play
        if (!club.queue || club.queue.length === 0) {
            club.currentVideo = null
            club.currentVideoStartTime = null
            club.voteSkipCount = 0
            club.votes = null
            this.clubGateway.emitPlayNext(club.id, club)
            await club.save()
            return club
        }

        const newVideoId = club.queue.shift()
        club.currentVideo = newVideoId
        club.currentVideoStartTime = new Date()
        club.voteSkipCount = 0
        club.votes = null
        this.clubGateway.emitPlayNext(club.id, club)
        this.createVideoEndTimeout(
            club.id,
            newVideoId,
            club.currentVideoStartTime
        )
        await club.save()

        return club
    }

    async voteSkip(
        id: Club["id"],
        authUser: AuthUserPayload
    ): Promise<Club["voteSkipCount"]> {
        const club = await this.clubRepo.findOneBy({ id })
        if (club.votes && club.votes.includes(authUser.id.toString())) {
            return club.voteSkipCount
        }
        club.voteSkipCount = club.voteSkipCount + 1
        const roomSize = this.clubGateway.getJoinedUsers(club.id)
        if (club.voteSkipCount > roomSize / 2) {
            await this.playNextVideo(club.id)
            return 0
        }

        if (club.votes) {
            club.votes.push(authUser.id.toString())
        } else {
            club.votes = [authUser.id.toString()]
        }
        await club.save()
        return club.voteSkipCount
    }

    async getPlayerPayload(id: Club["id"]): Promise<PlayerPayload> {
        const club = await this.clubRepo.findOne({
            where: { id },
            select: {
                id: true,
                currentVideo: true,
                currentVideoStartTime: true,
                voteSkipCount: true,
            },
        })
        return club
    }

    async createVideoEndTimeout(
        clubId: Club["id"],
        videoId: string,
        currentVideoStartTime: Date
    ) {
        const videoDuration =
            await this.youtubeService.getVideoDuration(videoId)
        console.log(videoDuration)
        const time =
            videoDuration - (Date.now() - currentVideoStartTime.getTime())
        const timerName = clubId + "-" + videoId
        console.log(`Timeout time = ${time}`)
        const timeout = setTimeout(() => {
            console.log(`${timerName} is done playing....`)
            return this.playNextVideo(clubId)
        }, time)
        this.scheduler.addTimeout(timerName, timeout)
        console.log(`timer ${timerName} created`)
    }
}
