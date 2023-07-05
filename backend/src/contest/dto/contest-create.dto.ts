import { IsArray, IsDateString, IsNotEmpty, IsString, MaxLength } from "@nestjs/class-validator"
import { ContestRuleCreateDto } from "./contest-rule.create.dto"

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
}