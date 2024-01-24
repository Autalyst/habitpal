import { BaseEntity } from "src/typeorm/base.entity"
import { User } from "src/user/entity/user.entity"
import { Column, Entity, Generated, Index,  ManyToOne } from "typeorm"

@Entity()
export class UserAuthToken extends BaseEntity {
    @Column({
        type: 'timestamptz'
    })
    expiresAt: Date

    @ManyToOne(() => User, (user) => user.auth)
    user: User

    @Column()
    @Index()
    refreshTokenHash: string
}
