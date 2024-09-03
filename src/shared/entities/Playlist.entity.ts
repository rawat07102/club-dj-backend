import { Column } from "typeorm";
import { AbstractEntity } from "./Abstract.entity";
import { User } from "./User.entity";

export class Playlist extends AbstractEntity {
    @Column()
    name: string

    @Column()
    list: string[]

    @Column()
    likeCount: number

    @Column()
    modifier: User["id"] | "club"
}
