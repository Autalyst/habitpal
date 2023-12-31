import { Injectable } from "@nestjs/common";
import { User, Contest, ContestantStatus } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ContestService {
    constructor(private prismaService: PrismaService) { }

    async getAvailableContestsForUser(user: User): Promise<Contest[]> {
        return this.prismaService.contest.findMany({
            orderBy: [
                {
                    startTime: 'asc',
                },
                {
                    endTime: 'asc'
                }
            ],
            where: {
                publishTime: { lt: new Date(Date.now()) },
                endTime: { lt: new Date(Date.now() + (1209600000)) }, // + 2 weeks
                contestants: {
                    some: {
                        userId: user.id,
                        status: { not: ContestantStatus.QUIT }
                    }
                }
            },
            include: {
                _count: {
                    select: {
                        contestants: {
                            where: {
                                status: { not: ContestantStatus.QUIT }
                            }
                        }
                    }
                }
            }
        });
    }
}