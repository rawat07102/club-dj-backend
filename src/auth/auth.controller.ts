import { Controller, Post, Get, UseGuards, Inject } from "@nestjs/common"
import { Routes, Services } from "@/shared/constants"
import { IAuthService } from "./interfaces/IAuthService.interface"
import { JwtAuthGuard, LocalAuthGuard } from "./utils/guards"
import { AuthenticatedUser } from "@/shared/utils/decorators"
import { AuthUserPayload } from "@/shared/utils/types"

@Controller(Routes.AUTH)
export class AuthController {
    constructor(
        @Inject(Services.AUTH_SERVICE)
        private readonly authService: IAuthService
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post()
    async login(@AuthenticatedUser() authUser: AuthUserPayload) {
        const token = await this.authService.createToken(authUser)
        return {
            payload: authUser,
            accessToken: token,
        }
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async authCheck(
        @AuthenticatedUser() authUser: AuthUserPayload
    ) {
        return authUser
    }
}
