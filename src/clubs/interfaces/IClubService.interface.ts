import { Club, User } from "@/shared/entities"
import { AuthUserPayload, FindAllOptions } from "@/shared/utils/types"
import { PostClubDto } from "../dtos/CreateClub.dto"

export interface IClubService {
    create(
        clubDto: PostClubDto,
        authUser: AuthUserPayload
    ): Promise<Club["id"]>
    addVideoToQueue(
        id: Club["id"],
        videoId: string,
        authUser: AuthUserPayload
    ): Promise<Club["queue"]>
    removeVideoFromQueue(
        id: Club["id"],
        videoId: string,
        authUser: AuthUserPayload
    ): Promise<Club["queue"]>
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
}
