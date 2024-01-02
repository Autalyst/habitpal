import { Entity, Column, Index, OneToOne, OneToMany } from 'typeorm'
import { UserAuth } from '../auth/entity/user-auth.entity'
import { UserAuthToken } from '../auth/entity/user-auth-token.entity'
import { BaseEntity } from 'src/typeorm/base.entity'

@Entity()
export class User extends BaseEntity {
    @Column({
        length: 128,
        unique: true
    })
    @Index()
    email: string

    @OneToOne(() => UserAuth, (userAuth) => userAuth.user, { cascade: true })
    auth: UserAuth

    @OneToMany(() => UserAuthToken, (userAuthToken) => userAuthToken.user)
    authToken: UserAuthToken[]
}