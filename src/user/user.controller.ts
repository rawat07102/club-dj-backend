import {
    Controller,
    Param,
    Get,
    Delete,
    ParseIntPipe,
    Inject,
    Query,
} from "@nestjs/common"
import { Routes, Services } from "@/shared/constants"
import { IUserService } from "./interfaces/IUserService.interface"

@Controller(Routes.USERS)
export class UserController {
    constructor(
        @Inject(Services.USER_SERVICE)
        private userService: IUserService,
    ) { }

    @Get("all")
    async getAllUsers(
        @Query("start") start: number,
        @Query("count") count: number,
    ) {
        return this.userService.findAll({ start, count })
    }

    @Get(":userId")
    async getById(@Param("userId", ParseIntPipe) userId: number) {
        return this.userService.findById(userId)
    }

    @Delete(":userId")
    async delete(@Param("userId", ParseIntPipe) userId: number) {
        return this.userService.delete(userId)
    }
}
