import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { configuration } from "./shared/config"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { IConfiguration } from "./shared/config/configuration.interface"
import { AuthModule } from "./auth/auth.module"
import { UserModule } from "./user/user.module"
import { ClubsModule } from "./clubs/clubs.module"
import { entities } from "./shared/entities"
import { PlaylistsModule } from "./playlists/playlists.module"
import { YoutubeModule } from './youtube/youtube.module';
import { GenresModule } from './genres/genres.module';
import { ScheduleModule } from "@nestjs/schedule"

@Module({
    imports: [
        ScheduleModule.forRoot(),
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
                //logging: process.env.NODE_ENV === "dev",
                logging: false,
                synchronize: process.env.NODE_ENV === "dev",
            }),
            inject: [ConfigService],
        }),
        AuthModule,
        UserModule,
        ClubsModule,
        PlaylistsModule,
        YoutubeModule,
        GenresModule,
    ],
})
export class AppModule {}
