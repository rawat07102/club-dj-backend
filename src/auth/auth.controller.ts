import {
    Controller,
    Post,
    Get,
    UseGuards,
    Inject,
} from "@nestjs/common"
import { Routes, Services } from "@/shared/constants"
import { IAuthService } from "./interfaces/IAuthService.interface"
import { JwtAuthGuard, LocalAuthGuard } from "./utils/guards"
import { AuthenticatedUser } from "@/shared/utils/decorators"
import { AuthenticatedRequest } from "@/shared/utils/interface"

@Controller(Routes.AUTH)
export class AuthController {
    constructor(
        @Inject(Services.AUTH_SERVICE)
        private readonly authService: IAuthService,
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post()
    async login(@AuthenticatedUser() authUser: AuthenticatedRequest["user"]) {
        const token = await this.authService.createToken(authUser)
        return {
            accessToken: token,
        }
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async authCheck(
        @AuthenticatedUser() authUser: AuthenticatedRequest["user"]
    ) {
        return authUser
    }
}
