import { forwardRef, Module } from "@nestjs/common"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { ConfigService } from "@nestjs/config"
import { IConfiguration } from "@/shared/config/configuration.interface"
import { Services } from "@/shared/constants"
import { JwtModule } from "@nestjs/jwt"
import { UserModule } from "@/user/user.module"
import { JwtAuthGuard, LocalAuthGuard } from "./utils/guards"
import { PassportModule } from "@nestjs/passport"
import { LocalStrategy } from "./utils/LocalStrategy"
import { JwtStrategy } from "./utils/JwtStrategy"

@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (
                configService: ConfigService<IConfiguration, true>
            ) => ({
                secret: configService.get("jwt.secret", { infer: true }),
            }),
        }),
        PassportModule,
        forwardRef(() => UserModule),
    ],
    providers: [
        LocalAuthGuard,
        JwtAuthGuard,
        LocalStrategy,
        JwtStrategy,
        { useClass: AuthService, provide: Services.AUTH_SERVICE },
    ],
    exports: [
        JwtAuthGuard,
        { useClass: AuthService, provide: Services.AUTH_SERVICE },
    ],
    controllers: [AuthController],
})
export class AuthModule {}
