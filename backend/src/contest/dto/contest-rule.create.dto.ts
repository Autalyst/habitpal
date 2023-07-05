import { IsEnum } from "@nestjs/class-validator";
import { ContestRuleType } from "@prisma/client";

export class ContestRuleCreateDto {
    @IsEnum(ContestRuleType)
    ruleType: ContestRuleType
}