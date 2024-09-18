import { Module } from "@nestjs/common"
import { PlaylistsService } from "./playlists.service"
import { PlaylistsController } from "./playlists.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Playlist } from "@/shared/entities"
import { Services } from "@/shared/constants"
import { UserModule } from "@/user/user.module"

@Module({
    imports: [TypeOrmModule.forFeature([Playlist]), UserModule],
    providers: [
        { useClass: PlaylistsService, provide: Services.PLAYLISTS_SERVICE },
    ],
    exports: [
        { useClass: PlaylistsService, provide: Services.PLAYLISTS_SERVICE },
    ],
    controllers: [PlaylistsController],
})
export class PlaylistsModule {}
