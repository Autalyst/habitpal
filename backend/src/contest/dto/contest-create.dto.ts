import { IsArray, IsDateString, IsNotEmpty, IsString, MaxLength } from "@nestjs/class-validator"
import { ContestRuleCreateDto } from "./contest-rule.create.dto"
import { Contest, User } from "@prisma/client"

export class ContestCreateDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    title: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsDateString()
    startTime: Date

    @IsDateString()
    endTime: Date

    @IsArray()
    contestRules: ContestRuleCreateDto[]

    mapOnto(record: Contest, ownerUser: User) {
        record.title = this.title;
        record.description = this.description;
        record.userId = ownerUser.id;
        record.startTime = this.startTime;
        record.endTime = this.endTime;
    }
}