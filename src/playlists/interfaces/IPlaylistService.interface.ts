import { Club, Playlist, User } from "@/shared/entities"
import { AuthUserPayload } from "@/shared/utils/types"

export interface IPlaylistService {
    findAll(): Promise<Playlist[]>
    findById(id: Playlist["id"]): Promise<Playlist>
    create(name: string, authUser: AuthUserPayload): Promise<Playlist>
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
    delete(id: Playlist["id"]): Promise<void>
    isCreator(id: Playlist["id"], userId: User["id"]): Promise<boolean>
}
