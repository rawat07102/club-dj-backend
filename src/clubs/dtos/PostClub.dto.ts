import { Club, Genre } from "@/shared/entities"
import { PickType } from "@nestjs/mapped-types"
import { IsInt } from "class-validator"

export class PostClubDto extends PickType(Club, [
    "name",
    "description",
] as const) {
    @IsInt({ each: true })
    genreIds: Genre["id"][]
}
