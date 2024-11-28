import { Club } from "@/shared/entities"
import { PickType } from "@nestjs/mapped-types"

export class PlayerPayload extends PickType(Club, [
    "currentVideo",
    "currentVideoStartTime",
    "voteSkipCount",
    "id",
] as const) {}
