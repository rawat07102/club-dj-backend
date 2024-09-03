import { Column, Entity } from "typeorm"
import { Exclude } from "class-transformer"
import { AbstractEntity } from "./Abstract.entity";

@Entity()
export class User extends AbstractEntity {
    @Column()
    username: string;

    @Column()
    email: string

    @Column()
    @Exclude()
    password: string;

    @Column({
        default: 0
    })
    stars: number;
}
