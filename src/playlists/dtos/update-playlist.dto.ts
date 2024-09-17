import { Playlist } from "@/shared/entities"
import { PickType } from "@nestjs/mapped-types"

export class UpdatePlaylistDto extends PickType(Playlist, [
    "list",
] as const) {
}
