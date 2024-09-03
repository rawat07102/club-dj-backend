import { Controller, Body, Post, Get, UseGuards, Inject } from "@nestjs/common"
import { CreateUserDto } from "./dtos/CreateUser.dto"
import { Routes, Services } from "@/shared/constants"
import { IAuthService } from "./interfaces/IAuthService.interface"
import { IUserService } from "@/user/interfaces/IUserService.interface"
import { JwtAuthGuard, LocalAuthGuard } from "./utils/guards"
import { AuthenticatedUser } from "@/shared/utils/decorators"
import { AuthenticatedRequest } from "@/shared/utils/interface"

@Controller(Routes.AUTH)
export class AuthController {
    constructor(
        @Inject(Services.AUTH_SERVICE)
        private readonly authService: IAuthService,

        @Inject(Services.USER_SERVICE)
        private readonly userService: IUserService
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post("login")
    async login(@AuthenticatedUser() authUser: AuthenticatedRequest["user"]) {
        const token = await this.authService.createToken(
            authUser.id,
            authUser.username
        )
        return {
            accessToken: token,
        }
    }

    @Post("register")
    async create(@Body() { username, password, email }: CreateUserDto) {
        return this.userService.create({ username, password, email })
    }

    @Get("status")
    @UseGuards(JwtAuthGuard)
    async authCheck(
        @AuthenticatedUser() authUser: AuthenticatedRequest["user"]
    ) {
        return authUser
    }
}
