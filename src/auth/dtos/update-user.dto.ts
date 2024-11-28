import { User } from "@/shared/entities"
import { PickType } from "@nestjs/mapped-types"

export class UpdateUserDto extends PickType(User, ["bio"] as const) {}
