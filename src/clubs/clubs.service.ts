import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common"
import { IClubService } from "./interfaces/IClubService.interface"
import { Club, Genre, User } from "@/shared/entities"
import { AuthUserPayload, Buckets, FindAllOptions } from "@/shared/utils/types"
import { PostClubDto } from "./dtos/PostClub.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { IUserService } from "@/user/interfaces/IUserService.interface"
import { Services } from "@/shared/constants"
import { PatchClubDto } from "./dtos/PatchClub.dto"
import { ImagesService } from "@/images.service"
import * as path from "path"
import { IGenresService } from "@/genres/interfaces/IGenresService.interface"

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
        private imageService: ImagesService
    ) {}

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
            this.createFileName(id, path.extname(file.originalname))
        )
        club.thumbnail = imageUrl
        await club.save()
        return club.thumbnail
    }

    private createFileName(id: Club["id"], fileExtension: string) {
        return `${id}-thumbnail${fileExtension}`
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
        const club = await this.clubRepo.findOne({
            where: { id },
        })

        if (club.creatorId !== authUser.id) {
            throw new UnauthorizedException(
                "Only club owner can make changes to the queue."
            )
        }

        if (club.queue) {
            if (club.queue.includes(videoId)) {
                throw new ConflictException("Video already in queue")
            }
            club.queue.push(videoId)
        } else {
            club.queue = [videoId]
        }

        await club.save()
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

    async create(
        { genreIds, ...clubDto }: PostClubDto,
        authUser: AuthUserPayload
    ): Promise<Club["id"]> {
        const newClub = this.clubRepo.create(clubDto)
        newClub.queue = []
        const user = await this.userService.findById(authUser.id)
        user.clubs.push(newClub)
        await user.save()
        await this.clubRepo
            .createQueryBuilder()
            .relation(Club, "genres")
            .of(newClub)
            .add(genreIds)
        return newClub.id
    }

    async findAll({
        skip = 0,
        take = 10,
        searchQuery,
    }: FindAllOptions): Promise<Club[]> {
        return this.clubRepo
            .createQueryBuilder("club")
            .addSelect("similarity(name, :searchQuery)", "score")
            .where("similarity(name, :searchQuery) > 0.1")
            .setParameter("searchQuery", searchQuery)
            .orderBy("score", "DESC")
            .take(take)
            .skip(skip)
            .getMany()
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
}
