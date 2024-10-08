import {
    Entity,
    Column,
    ManyToOne,
    OneToMany,
    OneToOne,
    ManyToMany,
    JoinColumn,
    JoinTable,
    AfterLoad,
} from "typeorm"
import { AbstractEntity } from "./Abstract.entity"
import { User } from "./User.entity"
import { Playlist } from "./Playlist.entity"

@Entity()
export class Club extends AbstractEntity {
    @Column({
        unique: true,
    })
    name: string

    @Column({
        default: "",
    })
    description: string

    @Column({ nullable: true })
    thumbnail?: string

    @Column("simple-array")
    queue: string[]

    @OneToOne(() => User, { nullable: true })
    @JoinColumn()
    currentDJ: User

    @OneToMany(() => User, (user) => user.wishlistJoined)
    @JoinColumn()
    djWishlist: User[]

    @Column({ nullable: true })
    creatorId: number

    @ManyToOne(() => User, (creator) => creator.clubs)
    creator: User

    @ManyToMany(() => User, (user) => user.clubsFollowed)
    @JoinTable()
    followers: User[]

    followersCount: number

    @OneToMany(() => Playlist, (playlist) => playlist.club)
    @JoinColumn()
    playlists: Playlist[]

    @AfterLoad()
    updateCounters() {
        this.followersCount = this.followers?.length || 0
    }
}
