import { Playlist } from "@/shared/entities"
import { CreatePlaylistDto } from "../dtos/create-playlist.dto"
import { AuthUserPayload } from "@/shared/utils/types"

export interface IPlaylistService {
    findById(id: Playlist["id"]): Promise<Playlist>
    searchUsersPlaylsits(userId: User["id"], playlistId: Playlist["id"]): Promise<Playlist>
    create(
        dto: CreatePlaylistDto,
        authUser: AuthUserPayload
    ): Promise<Playlist>
}
