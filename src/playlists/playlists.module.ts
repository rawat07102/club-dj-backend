import { Module } from "@nestjs/common"
import { PlaylistsService } from "./playlists.service"
import { PlaylistsController } from "./playlists.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Playlist } from "@/shared/entities"
import { Services } from "@/shared/constants"

@Module({
    imports: [TypeOrmModule.forFeature([Playlist])],
    providers: [
        { useValue: PlaylistsService, provide: Services.PLAYLISTS_SERVICE },
    ],
    exports: [
        { useValue: PlaylistsService, provide: Services.PLAYLISTS_SERVICE },
    ],
    controllers: [PlaylistsController],
})
export class PlaylistsModule {}
