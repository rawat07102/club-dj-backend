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
import { UpdateUserDto } from "@/auth/dtos/update-user.dto"

@Controller(Routes.USERS)
export class UserController {
    constructor(
        @Inject(Services.USER_SERVICE)
        private readonly userService: IUserService
    ) {}

    @Get()
    async getAllUsers(
        @Query("skip") skip: number,
        @Query("take") take: number
    ) {
        return this.userService.findAll({ skip, take })
    }

    @Post()
    async createUser(@Body() { username, password }: CreateUserDto) {
        return this.userService.create({ username, password })
    }

    @Put("me/profile-pic")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor("profile-pic"))
    async uploadProfilePic(
        @UploadedFile() file: Express.Multer.File,
        @AuthenticatedUser() authUser: AuthUserPayload
    ) {
        return this.userService.changeProfilePic(file, authUser)
    }

    @Delete("me/profile-pic")
    @UseGuards(JwtAuthGuard)
    async deleteProfilePic(@AuthenticatedUser() authUser: AuthUserPayload) {
        return this.userService.deleteProfilePic(authUser.id)
    }

    @Get(":userId")
    async getById(@Param("userId", ParseIntPipe) userId: number) {
        const user = await this.userService.findById(userId)
        return user
    }

    @UseGuards(JwtAuthGuard)
    @Patch("me")
    async updateUser(
        @Body() dto: UpdateUserDto,
        @AuthenticatedUser() authUser: AuthUserPayload
    ) {
        return this.userService.updateUserDetails(authUser.id, dto)
    }

    @UseGuards(JwtAuthGuard)
    @Delete("me")
    async delete(
        @AuthenticatedUser() authUser: AuthUserPayload
    ) {
        return this.userService.delete(authUser.id)
    }
}
