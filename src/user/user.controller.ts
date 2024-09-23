import {
    Controller,
    Param,
    Get,
    Delete,
    ParseIntPipe,
    Inject,
    Query,
    Post,
    Body,
    NotImplementedException,
    Patch,
    UseGuards,
    UploadedFile,
    UseInterceptors,
    Put,
} from "@nestjs/common"
import { Routes, Services } from "@/shared/constants"
import { IUserService } from "./interfaces/IUserService.interface"
import { CreateUserDto } from "@/auth/dtos/CreateUser.dto"
import { JwtAuthGuard } from "@/auth/utils/guards"
import { AuthenticatedUser } from "@/shared/utils/decorators"
import { AuthUserPayload } from "@/shared/utils/types"
import { FileInterceptor } from "@nestjs/platform-express"

@Controller(Routes.USERS)
export class UserController {
    constructor(
        @Inject(Services.USER_SERVICE)
        private readonly userService: IUserService,
    ) {}

    @Get()
    async getAllUsers(
        @Query("skip") skip: number,
        @Query("take") take: number
    ) {
        return this.userService.findAll({ skip, take })
    }

    @Post()
    async createUser(@Body() { username, password, email }: CreateUserDto) {
        return this.userService.create({ username, password, email })
    }

    @Put("me/profile-pic")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor("file"))
    async uploadProfilePic(
        @UploadedFile() file: Express.Multer.File,
        @AuthenticatedUser() authUser: AuthUserPayload
    ) {
        return this.userService.changeProfilePic(file, authUser)
    }

    @Delete("me/profile-pic")
    @UseGuards(JwtAuthGuard)
    async deleteProfilePic(
        @AuthenticatedUser() authUser: AuthUserPayload
    ) {
        return this.userService.deleteProfilePic(authUser.id)
    }


    @Get(":userId")
    async getById(@Param("userId", ParseIntPipe) userId: number) {
        return this.userService.findById(userId)
    }

    @UseGuards(JwtAuthGuard)
    @Patch(":userId")
    async updateUser(
        @Param("userId", ParseIntPipe) userId: number,
        @AuthenticatedUser() authUser: AuthUserPayload
    ) {
        return new NotImplementedException("PATCH /users/:userId")
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":userId")
    async delete(
        @Param("userId", ParseIntPipe) userId: number,
        @AuthenticatedUser() authUser: AuthUserPayload
    ) {
        return this.userService.delete(userId)
    }
}
