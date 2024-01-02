import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, Unique, OneToOne, OneToMany } from 'typeorm'
import { UserAuth } from '../auth/entity/user-auth.entity'
import { UserAuthToken } from '../auth/entity/user-auth-token.entity'

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid') 
    id: string

    @CreateDateColumn({
        type: 'timestamptz'
    })
    createdAt: Date

    @UpdateDateColumn({
        type: 'timestamptz'
    })
    updatedAt: Date

    @Column({
        length: 100,
        unique: true
    })
    @Index()
    email: string

    @OneToOne(() => UserAuth, (userAuth) => userAuth.user, { cascade: true })
    auth: UserAuth

    @OneToMany(() => UserAuthToken, (userAuthToken) => userAuthToken.user)
    authToken: UserAuthToken[]
}