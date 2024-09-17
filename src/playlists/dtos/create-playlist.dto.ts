import { Playlist } from "@/shared/entities"
import { PickType } from "@nestjs/mapped-types"
export class CreatePlaylistDto extends PickType(Playlist, [
    "name",
    "description",
] as const) {}
