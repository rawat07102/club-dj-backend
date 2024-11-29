import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
} from "typeorm"
import { Exclude } from "class-transformer"
import { AbstractEntity } from "./Abstract.entity"
import { Club } from "./Club.entity"
import { Playlist } from "./Playlist.entity"

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

    @Column({ nullable: true })
    profilePic: string | null

    @Column()
    @Exclude()
    password: string

    @Column({ nullable: true })
    lastQueued: Date | null

    @OneToMany(() => Playlist, (playlist) => playlist.creator)
    @JoinColumn()
    playlists: Playlist[]

    @OneToMany(() => Club, (club) => club.creator, {
        cascade: ["insert"],
    })
    @JoinColumn()
    clubs: Club[]
}
