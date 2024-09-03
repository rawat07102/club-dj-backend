import { Request } from "express"
import { AuthUserPayload } from "./types"

export interface AuthenticatedRequest extends Request {
    user: AuthUserPayload
}
