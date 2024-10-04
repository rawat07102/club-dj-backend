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
import { Genre } from "./Genre.entity"
import { IsInt, IsString, IsUrl, Length, MaxLength } from "class-validator"

@Entity()
export class Club extends AbstractEntity {
    @Length(4, 24)
    @IsString()
    @Column({
        unique: true,
    })
    name: string

    @MaxLength(255)
    @IsString()
    @Column()
    description: string

    @Column({ nullable: true})
    @IsUrl()
    thumbnail: string

    @IsString({ each: true })
    @Column("simple-array")
    queue: string[]

    @ManyToMany(() => Genre)
    @JoinTable()
    @IsInt({
        each: true,
    })
    genres: Genre[]

    @OneToOne(() => User, { nullable: true })
    @JoinColumn()
    currentDJ: User

    @OneToMany(() => User, (user) => user.wishlistJoined)
    @JoinColumn()
    djWishlist: User[]

    @ManyToOne(() => User, (creator) => creator.clubs)
    creator: User
    @Column()
    creatorId: number

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
