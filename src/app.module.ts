import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "@/shared/entities/User.entity"
import { configuration } from "./shared/config"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { IConfiguration } from "./shared/config/configuration.interface"
import { AuthModule } from "./auth/auth.module"
import { UserModule } from "./user/user.module"
import { ClubsModule } from "./clubs/clubs.module"
import { entities } from "./shared/entities"

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        TypeOrmModule.forRootAsync({
            useFactory: async (
                configService: ConfigService<IConfiguration, true>
            ) => ({
                type: "postgres",
                url: configService.get("database.url", { infer: true }),
                entities: entities,
                logging: true,
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([User]),
        AuthModule,
        UserModule,
        ClubsModule,
    ],
})
export class AppModule {}
