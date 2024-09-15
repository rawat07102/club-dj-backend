import { CreateUserDto } from "@/auth/dtos/CreateUser.dto"
import { Club, User } from "@/shared/entities"
import { AuthUserPayload, FindAllOptions } from "@/shared/utils/types"

export interface IUserService {
    create(dto: CreateUserDto): Promise<User["id"]>
    addClubToUserFollow(
        id: User["id"],
        clubId: Club["id"],
        authUser: AuthUserPayload
    ): Promise<void>
    removeClubFromUserFollow(
        id: User["id"],
        clubId: Club["id"],
        authUser: AuthUserPayload
    ): Promise<void>
    findAll(args: FindAllOptions): Promise<User[]>
    findByUsername(username: User["username"]): Promise<User>
    findById(id: User["id"]): Promise<User>
    delete(id: User["id"]): Promise<boolean>
}
