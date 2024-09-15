import { Column, ManyToOne } from "typeorm"
import { AbstractEntity } from "./Abstract.entity"
import { User } from "./User.entity"
import { Club } from "./Club.entity"

export class Playlist extends AbstractEntity {
    @Column()
    name: string

    @Column()
    list: string[]

    @Column()
    likeCount: number

    @ManyToOne(() => User, user => user.playlists)
    creator: User

    @ManyToOne(() => Club, club => club.playlists)
    club: Club
}
