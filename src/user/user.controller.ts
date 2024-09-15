import {
    Controller,
    Param,
    Get,
    Delete,
    ParseIntPipe,
    Inject,
    Query,
    Post,
    Body,
    NotImplementedException,
    Patch,
} from "@nestjs/common"
import { Routes, Services } from "@/shared/constants"
import { IUserService } from "./interfaces/IUserService.interface"
import { CreateUserDto } from "@/auth/dtos/CreateUser.dto"

@Controller(Routes.USERS)
export class UserController {
    constructor(
        @Inject(Services.USER_SERVICE)
        private userService: IUserService
    ) {}

    @Get()
    async getAllUsers(
        @Query("start") start: number,
        @Query("count") count: number
    ) {
        return this.userService.findAll({ start, count })
    }

    @Post()
    async createUser(@Body() { username, password, email }: CreateUserDto) {
        return this.userService.create({ username, password, email })
    }

    @Get(":userId")
    async getById(@Param("userId", ParseIntPipe) userId: number) {
        return this.userService.findById(userId)
    }

    @Patch(":userId")
    async updateUser(@Param("userId", ParseIntPipe) userId: number) {
        return new NotImplementedException("PATCH /users/:userId")
    }

    @Delete(":userId")
    async delete(@Param("userId", ParseIntPipe) userId: number) {
        return this.userService.delete(userId)
    }
}
