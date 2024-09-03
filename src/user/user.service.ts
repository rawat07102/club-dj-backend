import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { User } from "@/shared/entities"
import { Repository } from "typeorm"
import {
    createUserDetails,
    findAllOptions,
    IUserService,
} from "./interfaces/IUserService.interface"
import * as bcrypt from "bcrypt"

@Injectable()
export class UserService implements IUserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async create({
        username,
        password,
        email,
    }: createUserDetails): Promise<User["id"]> {
        try {
            const passwordHash = await bcrypt.hash(password, 10)
            const user = this.userRepository.create({
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

    async findAll({ start = 0, count = 10 }: findAllOptions): Promise<User[]> {
        return this.userRepository.find({
            skip: start,
            take: count,
        })
    }

    async findByUsername(username: User["username"]): Promise<User> {
        return this.userRepository.findOne({
            where: {
                username,
            },
        })
    }

    async findById(id: User["id"]): Promise<User> {
        return this.userRepository.findOne({
            where: {
                id,
            },
        })
    }

    async delete(id: number) {
        const user = await this.userRepository.findOneBy({ id })
        await user.remove()
        return true
    }
}
