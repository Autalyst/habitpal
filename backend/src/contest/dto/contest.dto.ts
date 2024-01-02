import { BaseDto } from "src/util/base.dto";
import { Contest } from "../entity/contest.entity";

export class ContestDto extends BaseDto {
    id: string
    createdAt: Date
    updatedAt: Date

    name: string
    description: string

    publishDate: Date
    startDate: Date
    endDate: Date

    constructor(entity: Contest) {
        super(entity);
        this.name = entity.name;
        this.description = entity.description;
        this.publishDate = entity.publishDate;
        this.startDate = entity.startDate;
        this.endDate = entity.endDate;
    }
}