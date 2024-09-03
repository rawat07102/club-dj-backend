import { ExtractJwt, Strategy } from "passport-jwt"
import { PassportStrategy } from "@nestjs/passport"
import { Inject, Injectable } from "@nestjs/common"
import { IConfiguration } from "@/shared/config/configuration.interface"
import { ConfigService } from "@nestjs/config"
import { AuthUserPayload } from "@/shared/utils/types"
import { AuthenticatedRequest } from "@/shared/utils/interface"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject()
        configService: ConfigService<IConfiguration, true>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get("jwt.secret", { infer: true }),
        })
    }

    validate(payload: AuthUserPayload): AuthenticatedRequest["user"] {
        return payload
    }
}
