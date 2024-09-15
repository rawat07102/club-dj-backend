import { Inject, Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { AuthUserPayload } from "@/shared/utils/types"
import { IAuthService } from "./interfaces/IAuthService.interface"
import { Services } from "@/shared/constants"
import { IUserService } from "@/user/interfaces/IUserService.interface"
import * as bcrypt from "bcrypt"

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        private jwtService: JwtService,

        @Inject(Services.USER_SERVICE)
        private userService: IUserService
    ) {}

    async validateUser(username: string, password: string) {
        const user = await this.userService.findByUsername(username)
        const isValid =
            !!user && (await bcrypt.compare(password, user.password))

        return isValid ? user : null
    }

    async createToken(payload: AuthUserPayload) {
        return this.jwtService.signAsync(payload)
    }

    async verifyToken(token: string) {
        return this.jwtService.verifyAsync(token)
    }

    async getUserByAuthToken(token: string) {
        const payload = this.jwtService.decode(token) as AuthUserPayload
        const user = await this.userService.findById(payload.id)
        return user
    }
}
