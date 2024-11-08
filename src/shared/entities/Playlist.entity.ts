import { Column, Entity, ManyToMany, ManyToOne } from "typeorm"
import { AbstractEntity } from "./Abstract.entity"
import { User } from "./User.entity"
import { Club } from "./Club.entity"

@Entity()
export class Playlist extends AbstractEntity {
    @Column()
    name: string

    @Column("simple-array", { nullable: true })
    list?: string[]

    @Column({
        default: "",
    })
    description: string

    @Column({nullable: true})
    thumbnail?: string

    @Column({ default: 0 })
    likeCount: number

    @ManyToOne(() => User, (user) => user.playlists)
    creator: User
    @Column()
    creatorId: number

    @ManyToOne(() => Club, (club) => club.playlists)
    club: Club
}
