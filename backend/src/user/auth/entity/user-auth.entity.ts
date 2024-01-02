import { BaseEntity } from "src/typeorm/base.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, JoinColumn, OneToOne} from "typeorm";

@Entity()
export class UserAuth extends BaseEntity {
    @OneToOne(() => User, (user) => user.auth)
    @JoinColumn()
    user: User

    @Column()
    hash: string
}