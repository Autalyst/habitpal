import { User } from "src/user/entity/user.entity"
import { Column, CreateDateColumn, Entity, Generated, Index,  ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class UserAuthToken {
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
        type: 'timestamptz'
    })
    expiresAt: Date

    @ManyToOne(() => User, (user) => user.auth)
    user: User

    @Column({
        unique: true
    })
    @Index()
    jwtToken: string

    @Column()
    @Generated('uuid')
    @Index()
    refreshToken: string
}
