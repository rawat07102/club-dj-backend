import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { AuthenticatedRequest } from "./interface"

export const AuthenticatedUser = createParamDecorator(
    (_data: unknown, context: ExecutionContext) => {
        //const type = context.getType()
        //if (type === "http") return getUserHttp(context)
        //return getUserWs(context)
        const request: AuthenticatedRequest = context.switchToHttp().getRequest()
        return request.user
    },
)
//
//const getUserHttp = (context: ExecutionContext) => {
//    const req = context.switchToHttp().getRequest()
//    return req.user
//}
//
//const getUserWs = (context: ExecutionContext) => {
//    const client = context.switchToWs().getClient()
//    return client.handshake.auth.user
//}
