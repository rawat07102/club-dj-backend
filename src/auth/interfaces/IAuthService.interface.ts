import { User } from "@/shared/entities"

export interface IAuthService {
    validateUser(
        username: string,
        password: string
    ): Promise<User | null>
    createToken(id: number, username: string): Promise<string>
    validateToken(token: string): Promise<boolean>
    decodeToken(token: string): Promise<any>
}
