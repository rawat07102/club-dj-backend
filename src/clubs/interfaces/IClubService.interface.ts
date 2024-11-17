import { Club, Playlist, User } from "@/shared/entities"
import { AuthUserPayload, FindAllOptions } from "@/shared/utils/types"
import { PatchClubDto } from "../dtos/PatchClub.dto"

export interface IClubService {
    updateClubDetails(
        id: Club["id"],
        dto: PatchClubDto,
        authUser: AuthUserPayload
    ): Promise<Club>
    changeClubThumbnail(
        id: Club["id"],
        file: Express.Multer.File,
        authUser: AuthUserPayload
    ): Promise<Club["thumbnail"]>
    deleteClubThumbnail(
        id: Club["id"],
        authUser: AuthUserPayload
    ): Promise<void>
    create(authUser: AuthUserPayload): Promise<Club["id"]>
    addVideoToQueue(
        id: Club["id"],
        videoId: string,
        authUser: AuthUserPayload
    ): Promise<Club>
    removeVideoFromQueue(
        id: Club["id"],
        videoId: string,
        authUser: AuthUserPayload
    ): Promise<Club>
    addUserToDjWishlist(
        id: Club["id"],
        userId: User["id"],
        authUser: AuthUserPayload
    ): Promise<Club["djWishlist"]>
    removeUserFromDjWishlist(
        id: Club["id"],
        userId: User["id"],
        authUser: AuthUserPayload
    ): Promise<Club["djWishlist"]>
    setCurrentDj(
        id: Club["id"],
        userId: User["id"],
        authUser: AuthUserPayload
    ): Promise<Club["currentDJ"]>
    addUserToClubFollowers(id: Club["id"], userId: User["id"]): Promise<void>
    removeUserFromClubFollowers(
        id: Club["id"],
        userId: User["id"]
    ): Promise<void>
    findAll(options: FindAllOptions): Promise<Club[]>
    findById(id: Club["id"]): Promise<Club>
    delete(id: Club["id"], authUser: AuthUserPayload): Promise<boolean>
    isCreator(clubId: Club["id"], userId: User["id"]): Promise<boolean>
    addPlaylistToClub(
        clubId: Club["id"],
        authUser: AuthUserPayload
    ): Promise<Playlist["id"]>
    removePlaylistFromClub(
        clubId: Club["id"],
        playlistId: Playlist["id"]
    ): Promise<void>
}
