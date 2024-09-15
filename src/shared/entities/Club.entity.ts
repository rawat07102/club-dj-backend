import {
    Entity,
    Column,
    ManyToOne,
    OneToMany,
    OneToOne,
    ManyToMany,
} from "typeorm"
import { AbstractEntity } from "./Abstract.entity"
import { User } from "./User.entity"
import { Playlist } from "./Playlist.entity"

@Entity()
export class Club extends AbstractEntity {
    @Column()
    name: string

    @Column({
        default: "",
    })
    description?: string

    @Column("simple-array", { default: [] })
    queue: string[]

    @OneToOne(() => User, { nullable: true })
    currentDJ: User | null

    @OneToMany(() => User, (user) => user.joinedWishlist)
    djWishlist: User[]

    @ManyToOne(() => User, (creator) => creator.clubs, { nullable: false })
    creator: User

    @ManyToMany(() => User, (user) => user.clubsFollowed)
    followers: User[]

    @OneToMany(() => Playlist, (playlist) => playlist.club)
    playlists: Playlist[]
}