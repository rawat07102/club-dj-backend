import { Module } from "@nestjs/common"
import { UserController } from "./user.controller"
import { UserService } from "./user.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "@/shared/entities"
import { Services } from "@/shared/constants"
import { ImagesService } from "@/images.service"

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserController],
    providers: [
        {
            useClass: UserService,
            provide: Services.USER_SERVICE,
        },
        ImagesService,
    ],
    exports: [
        {
            useClass: UserService,
            provide: Services.USER_SERVICE,
        },
    ],
})
export class UserModule {}
