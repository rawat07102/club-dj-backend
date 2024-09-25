import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { AuthenticatedRequest } from "./interface"
import { Socket } from "socket.io"

export const AuthenticatedUser = createParamDecorator(
    (_data: unknown, context: ExecutionContext) => {
        const type = context.getType()
        if (type === "http") return getUserHttp(context)
        return getUserWs(context)
        //const request: AuthenticatedRequest = context
        //    .switchToHttp()
        //    .getRequest()
        //return request.user
    }
)

const getUserHttp = (context: ExecutionContext) => {
    const req: AuthenticatedRequest = context.switchToHttp().getRequest()
    return req.user
}

const getUserWs = (context: ExecutionContext) => {
    const client: Socket = context.switchToWs().getClient()
    return client.data.authUser
}
