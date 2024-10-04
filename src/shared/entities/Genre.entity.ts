import { Column, Entity } from "typeorm";
import { AbstractEntity } from "./Abstract.entity";

@Entity()
export class Genre extends AbstractEntity {
    @Column()
    name: string
}
