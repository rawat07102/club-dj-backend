import { User } from "../entities"

export type AuthUserPayload = Pick<User, "id" | "username" | "email">
