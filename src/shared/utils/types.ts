import { User } from "../entities"

export type AuthUserPayload = Pick<User, "id" | "username" | "profilePic">

export type FindAllOptions = {
    skip?: number
    take?: number
    searchQuery?: string
}

export enum Buckets {
    USERS = "users",
    CLUBS = "clubs",
}
