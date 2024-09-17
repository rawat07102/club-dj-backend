import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Club, User } from "@/shared/entities"
import { Repository } from "typeorm"
import { IUserService } from "./interfaces/IUserService.interface"
import * as bcrypt from "bcrypt"
import { FindAllOptions } from "@/shared/utils/types"
import { CreateUserDto } from "@/auth/dtos/CreateUser.dto"

@Injectable()
export class UserService implements IUserService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>
    ) {}

    addClubToUserFollow(id: User["id"], clubId: Club["id"]): Promise<void> {
        return this.userRepo
            .createQueryBuilder()
            .relation(User, "clubsFollowed")
            .of(id)
            .add(clubId)
    }

    removeClubFromUserFollow(
        id: User["id"],
        clubId: Club["id"]
    ): Promise<void> {
        return this.userRepo
            .createQueryBuilder()
            .relation(User, "clubsFollowed")
            .of(id)
            .remove(clubId)
    }

    async create({
        username,
        password,
        email,
    }: CreateUserDto): Promise<User["id"]> {
        try {
            const passwordHash = await bcrypt.hash(password, 10)
            const user = this.userRepo.create({
                username,
                password: passwordHash,
                email,
            })
            await user.save()
            return user.id
        } catch (err) {
            throw new InternalServerErrorException("Failed to create a user")
        }
    }

    async findAll({ skip = 0, take = 10 }: FindAllOptions): Promise<User[]> {
        return this.userRepo.find({
            skip,
            take,
        })
    }

    async findByUsername(username: User["username"]): Promise<User> {
        return this.userRepo.findOne({
            where: {
                username,
            },
        })
    }

    async findById(id: User["id"]): Promise<User> {
        return this.userRepo.findOne({
            where: {
                id,
            },
        })
    }

    async delete(id: number) {
        const user = await this.userRepo.findOneBy({ id })
        await user.remove()
        return true
    }
}
