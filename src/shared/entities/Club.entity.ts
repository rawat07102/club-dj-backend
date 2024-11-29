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
import { IsString, IsUrl, Length, MaxLength } from "class-validator"

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

    @Column({ nullable: true })
    @IsUrl()
    thumbnail: string

    @Column("simple-array", { nullable: true })
    queue: string[] | null

    @Column({ default: 0 })
    timeBeforeNextQueue: number

    @Column({ nullable: true })
    currentVideo: string | null

    @Column({ nullable: true })
    currentVideoStartTime: Date | null

    @Column({ default: 0 })
    voteSkipCount: number

    @Column("simple-array", { nullable: true })
    votes: string[] | null

    @ManyToMany(() => Genre)
    @JoinTable()
    genres: Genre[]

    @ManyToOne(() => User, (creator) => creator.clubs)
    creator: User
    @Column()
    creatorId: number

    @OneToMany(() => Playlist, (playlist) => playlist.club)
    @JoinColumn()
    playlists?: Playlist[]
}
