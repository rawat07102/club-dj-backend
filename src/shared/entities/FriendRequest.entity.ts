import { Column, Entity, JoinColumn, OneToOne } from "typeorm"
import { AbstractEntity } from "./Abstract.entity"
import { User } from "./User.entity"

@Entity()
export class FriendRequest extends AbstractEntity {
    @JoinColumn()
    @OneToOne(() => User)
    from: User

    @JoinColumn()
    @OneToOne(() => User)
    to: User

    @Column()
    isPending: boolean
}
