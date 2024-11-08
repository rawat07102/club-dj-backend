import { Club, Playlist } from "@/shared/entities"
import { CreatePlaylistDto } from "../dtos/create-playlist.dto"
import { AuthUserPayload } from "@/shared/utils/types"

export interface IPlaylistService {
    findById(id: Playlist["id"]): Promise<Playlist>
    create(dto: CreatePlaylistDto, authUser: AuthUserPayload): Promise<Playlist>
    changePlaylistThumbnail(
        id: Playlist["id"],
        file: Express.Multer.File,
        authUser: AuthUserPayload
    ): Promise<Club["thumbnail"]>
    addVideoToPlaylist(
        id: Playlist["id"],
        videoId: string,
        authUser: AuthUserPayload
    ): Promise<void>
    removeVideoFromPlaylist(
        id: Playlist["id"],
        videoId: string,
        authUser: AuthUserPayload
    ): Promise<void>
}
