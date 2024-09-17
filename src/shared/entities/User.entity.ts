import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
} from "typeorm"
import { Exclude } from "class-transformer"
import { AbstractEntity } from "./Abstract.entity"
import { Club } from "./Club.entity"
import { Playlist } from "./Playlist.entity"
import { IsEmail } from "class-validator"

@Entity()
export class User extends AbstractEntity {
    @Column({
        length: 24,
    })
    username: string

    @Column({
        default: "",
    })
    bio: string

    @Column()
    @IsEmail()
    email: string

    @Column()
    @Exclude()
    password: string

    @Column({
        default: 0,
    })
    stars: number

    @ManyToMany(() => User, (user) => user.friends)
    friends: User[]

    @OneToMany(() => Playlist, (playlist) => playlist.creator)
    playlists: Playlist[]

    @JoinTable()
    @ManyToMany(() => Playlist, (playlist) => playlist.sharedWith)
    sharedPlaylists: Playlist[]

    @OneToMany(() => Club, (club) => club.creator)
    clubs: Club[]

    @ManyToOne(() => Club, (club) => club.djWishlist)
    wishlistJoined: Club

    @ManyToMany(() => Club, (club) => club.followers)
    clubsFollowed: Club[]
}
