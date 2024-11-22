import { User } from "@/shared/entities"
import { IsAlphanumeric, IsNotEmpty, Length } from "class-validator"

export class CreateUserDto {
    @IsNotEmpty()
    @Length(4, 24)
    @IsAlphanumeric()
    username: User["username"]

    @IsNotEmpty()
    @Length(8, 32)
    password: User["password"]
}
