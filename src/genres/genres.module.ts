import { Module } from "@nestjs/common"
import { GenresController } from "./genres.controller"
import { GenresService } from "./genres.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Genre } from "@/shared/entities"
import { Services } from "@/shared/constants"

@Module({
    imports: [TypeOrmModule.forFeature([Genre])],
    controllers: [GenresController],
    providers: [
        {
            provide: Services.GENRES_SERVICE,
            useClass: GenresService,
        },
    ],
    exports: [
        {
            provide: Services.GENRES_SERVICE,
            useClass: GenresService,
        },
    ],
})
export class GenresModule {}
