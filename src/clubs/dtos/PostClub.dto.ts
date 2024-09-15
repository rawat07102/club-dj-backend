import { Club } from "@/shared/entities"
import { IsNotEmpty, IsOptional, Length, MaxLength } from "class-validator"

export class PostClubDto {
    @Length(6, 32)
    @IsNotEmpty()
    name: Club["name"]

    @MaxLength(255)
    @IsOptional()
    description?: Club["description"]
}
