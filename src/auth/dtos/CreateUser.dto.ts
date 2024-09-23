import { User } from "@/shared/entities"
import { IsAlphanumeric, IsEmail, IsNotEmpty, Length } from "class-validator"

export class CreateUserDto {
    @IsNotEmpty()
    @Length(4, 24)
    @IsAlphanumeric()
    username: User["username"]

    @IsNotEmpty()
    @IsEmail()
    email: User["email"]

    @IsNotEmpty()
    @Length(8, 32)
    password: User["password"]
}
