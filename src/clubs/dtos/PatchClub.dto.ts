import { Club, Genre } from "@/shared/entities"
import {
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
    genreIds?: Genre["id"][]
}

