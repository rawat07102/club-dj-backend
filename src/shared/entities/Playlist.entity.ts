import { Column, Entity, ManyToMany, ManyToOne } from "typeorm"
import { AbstractEntity } from "./Abstract.entity"
import { User } from "./User.entity"
import { Club } from "./Club.entity"

@Entity()
export class Playlist extends AbstractEntity {
    @Column()
    name: string

    @Column("simple-array")
    list: string[]

    @Column({
        default: "",
    })
    description: string

    @Column()
    likeCount: number

    @ManyToOne(() => User, (user) => user.playlists)
    creator: User

    @ManyToOne(() => Club, (club) => club.playlists)
    club: Club

    @ManyToMany(() => User, (user) => user.sharedPlaylists)
    sharedWith: User[]
}
