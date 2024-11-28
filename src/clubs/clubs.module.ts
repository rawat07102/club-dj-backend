import { Module } from "@nestjs/common"
import { ClubsService } from "./clubs.service"
import { ClubsController } from "./clubs.controller"
import { Services } from "@/shared/constants"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Club } from "@/shared/entities"
import { UserModule } from "@/user/user.module"
import { PlaylistsModule } from "@/playlists/playlists.module"
import { ImagesService } from "@/images.service"
import { ClubsGateway } from "./clubs.gateway"
import { AuthModule } from "@/auth/auth.module"
import { GenresModule } from "@/genres/genres.module"
import { YoutubeModule } from "@/youtube/youtube.module"

@Module({
    imports: [
        TypeOrmModule.forFeature([Club]),
        UserModule,
        PlaylistsModule,
        AuthModule,
        GenresModule,
        YoutubeModule,
    ],
    providers: [
        {
            useClass: ClubsService,
            provide: Services.CLUB_SERVICE,
        },
        ImagesService,
        ClubsGateway,
    ],
    controllers: [ClubsController],
})
export class ClubsModule {}
