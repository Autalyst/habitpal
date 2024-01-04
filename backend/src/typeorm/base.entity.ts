import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseEntity {
    @PrimaryGeneratedColumn('increment', {
        type: 'bigint'
    })
    id: string

    @CreateDateColumn({
        type: 'timestamptz'
    })
    createdAt: Date

    @UpdateDateColumn({
        type: 'timestamptz'
    })
    updatedAt: Date
}