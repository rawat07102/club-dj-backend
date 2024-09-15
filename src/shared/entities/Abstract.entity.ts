import { instanceToPlain } from "class-transformer"
import {
    BaseEntity,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm"

export class AbstractEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    created: Date

    @UpdateDateColumn()
    updated: Date

    toJSON() {
        return instanceToPlain(this)
    }
}
