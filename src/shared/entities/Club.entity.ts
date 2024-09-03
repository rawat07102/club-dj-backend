import { Column } from "typeorm";
import { AbstractEntity } from "./Abstract.entity";
import { User } from "./User.entity";

export class Club extends AbstractEntity {
    @Column()
    name: string

    @Column()
    description: string

    @Column()
    djWishlist: User[]

    @Column()
    queue: string[]

    @Column()
    currentDJ: User
}
