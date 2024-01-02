import { User } from "src/user/entity/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class UserAuth {
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

    @OneToOne(() => User, (user) => user.auth)
    @JoinColumn()
    user: User

    @Column()
    hash: string
}