import { Module } from "@nestjs/common"
import { ClubsService } from "./clubs.service"
import { ClubsController } from "./clubs.controller"
import { Services } from "@/shared/constants"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Club } from "@/shared/entities"
import { UserModule } from "@/user/user.module"
import { PlaylistsModule } from "@/playlists/playlists.module"

@Module({
    imports: [TypeOrmModule.forFeature([Club]), UserModule, PlaylistsModule],
    providers: [
        {
            useClass: ClubsService,
            provide: Services.CLUB_SERVICE,
        },

    ],
    controllers: [ClubsController],
})
export class ClubsModule {}
