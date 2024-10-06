import { Club, Genre } from "@/shared/entities"
import {
    IsInt,
    IsOptional,
    IsString,
} from "class-validator"

export class PatchClubDto {
    @IsOptional()
    @IsString()
    name?: Club["name"]

    @IsOptional()
    @IsString()
    description?: Club["description"]

    @IsOptional()
    @IsInt({ each: true })
    genreIds?: Genre["id"][]
}

