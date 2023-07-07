import { Contest, ContestRuleType, ContestantStatus, Prisma, PrismaClient, User } from "@prisma/client";
import { GeneratedData, Seeder } from "./seeder";
import { faker } from '@faker-js/faker';
import { ContestCreateDto } from "src/contest/dto/contest-create.dto";

export class ContestSeeder implements Seeder {
    info(): string {
        return 'Contest';
    }

    async seed(
        prisma: PrismaClient, 
        generatedData: GeneratedData
    ): Promise<any> {
        await this.soloContest(prisma, generatedData);
    }

    private async soloContest(
        prisma: PrismaClient,
        generatedData: GeneratedData
    ): Promise<any> {
        const rules = [
            ContestRuleType.GROUPING_SOLO,
            ContestRuleType.STATS_VISIBLE,
            ContestRuleType.JOINING_FRIEND_OF_OWNER,
            ContestRuleType.SOURCE_SELF
        ];

        const contestDto: ContestCreateDto = {
            title: faker.music.genre(),
            description: faker.lorem.paragraph(),
            startTime: new Date(),
            endTime: new Date(),
            contestRules: rules.map(r => ({ ruleType: r}))
        }

        const user = generatedData.users[0];

        const contest = await this.makeContest(prisma, contestDto, user);

        generatedData.contests.push(contest);
    }

    private async makeContest(
        prisma: PrismaClient,
        contestCreateDto: ContestCreateDto,
        user: User,
    ): Promise<Contest> {
        const c = contestCreateDto;
        return await prisma.contest.create({
            data: {
                title: c.title,
                description: c.description,
                startTime: c.startTime,
                endTime: c.endTime,
                userId: user.id,

                contestRules: {
                    create: c.contestRules.map( rule => { 
                        return { 
                            ruleType: rule.ruleType 
                        }
                    })
                },

                contestants: {
                    create: {
                        userId: user.id,
                        status: ContestantStatus.IN_CONTEST
                    }
                }
            }
        })
    }
}