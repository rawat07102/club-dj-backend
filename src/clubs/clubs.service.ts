import { Inject, Injectable, UnauthorizedException } from "@nestjs/common"
import { IClubService } from "./interfaces/IClubService.interface"
import { Club, User } from "@/shared/entities"
import { AuthUserPayload, FindAllOptions } from "@/shared/utils/types"
import { PostClubDto } from "./dtos/PostClub.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { IUserService } from "@/user/interfaces/IUserService.interface"
import { Services } from "@/shared/constants"
import { PatchClubDto } from "./dtos/PatchClub.dto"

@Injectable()
export class ClubsService implements IClubService {
    constructor(
        @InjectRepository(Club)
        private clubRepo: Repository<Club>,
        @Inject(Services.USER_SERVICE)
        private userService: IUserService
    ) {}

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
    ): Promise<Club["queue"]> {
        const club = await this.clubRepo.findOneByOrFail({ id })
        if (club.creator.id !== authUser.id) {
            throw new UnauthorizedException(
                "Only club owner can make changes to the queue."
            )
        }
        club.queue.push(videoId)
        await club.save()
        return club.queue
    }

    async removeVideoFromQueue(
        id: Club["id"],
        videoId: string,
        authUser: AuthUserPayload
    ): Promise<Club["queue"]> {
        const club = await this.clubRepo.findOneByOrFail({ id })
        if (club.creator.id !== authUser.id) {
            throw new UnauthorizedException(
                "Only club owner can make changes to the queue."
            )
        }
        club.queue = club.queue.filter((id) => id !== videoId)
        await club.save()
        return club.queue
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
        clubDto: PostClubDto,
        authUser: AuthUserPayload
    ): Promise<Club["id"]> {
        const newClub = this.clubRepo.create(clubDto)
        const user = await this.userService.findById(authUser.id)
        if (!user) {
            throw new UnauthorizedException("User not found with given ID")
        }
        newClub.creator = user
        if (!user.clubs) {
            user.clubs = [newClub]
        } else {
            user.clubs.push(newClub)
        }
        await user.save()
        await newClub.save()
        return newClub.id
    }

    async findAll({ skip = 0, take = 10 }: FindAllOptions): Promise<Club[]> {
        return this.clubRepo.find({
            skip,
            take,
        })
    }

    async findById(id: Club["id"]): Promise<Club> {
        return this.clubRepo.findOneBy({ id })
    }

    async delete(id: Club["id"]): Promise<boolean> {
        const club = await this.clubRepo.findOneBy({ id })
        await club.remove()
        return true
    }

    async updateClubDetails(
        id: Club["id"],
        dto: PatchClubDto,
        authUser: AuthUserPayload
    ): Promise<Club> {
        const { name, description } = dto
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
