import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from "typeorm"
import { Exclude } from "class-transformer"
import { AbstractEntity } from "./Abstract.entity"
import { Club } from "./Club.entity"
import { Playlist } from "./Playlist.entity"

@Entity()
export class User extends AbstractEntity {
    @Column()
    username: string

    @Column()
    email: string

    @Column()
    @Exclude()
    password: string

    @Column({
        default: 0,
    })
    likes: number

    @OneToMany(() => Club, (club) => club.creator)
    clubs: Club[]

    @ManyToOne(() => Club, (club) => club.djWishlist)
    joinedWishlist: Club

    @ManyToMany(() => Club, (club) => club.followers)
    clubsFollowed: Club[]

    @OneToMany(() => Playlist, (playlist) => playlist.creator)
    playlists: Playlist[]
}
