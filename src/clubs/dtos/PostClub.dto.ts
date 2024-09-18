import { Club } from "@/shared/entities"
import { PickType } from "@nestjs/mapped-types"

export class PostClubDto extends PickType(Club, [
    "name",
    "description",
] as const) {}
