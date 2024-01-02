import { BaseEntity } from "src/typeorm/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Contest extends BaseEntity {
    @Column({ length: 128 })
    name: string

    @Column({ length: 8128 })
    description: string

    @Column({
        type: 'timestamptz',
        nullable: true
    })
    publishDate: Date

    @Column({
        type: 'timestamptz'
    })
    startDate: Date

    @Column({
        type: 'timestamptz'
    })
    endDate: Date
}