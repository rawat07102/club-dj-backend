import { Inject, Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-local"
import { Services } from "@/shared/constants"
import { IAuthService } from "../interfaces/IAuthService.interface"
import { instanceToPlain } from "class-transformer"

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(Services.AUTH_SERVICE)
        private readonly authService: IAuthService
    ) {
        super()
    }

    async validate(username: string, password: string) {
        const user = await this.authService.validateUser(username, password)
        if (!user) {
            throw new UnauthorizedException("User not found")
        }
        return instanceToPlain(user)
    }
}
