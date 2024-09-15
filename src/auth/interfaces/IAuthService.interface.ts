import { User } from "@/shared/entities"
import { AuthUserPayload } from "@/shared/utils/types"

export interface IAuthService {
    validateUser(username: string, password: string): Promise<User | null>
    createToken(payload: AuthUserPayload): Promise<string>
    verifyToken(token: string): Promise<boolean>
    getUserByAuthToken(token: string): Promise<any>
}
