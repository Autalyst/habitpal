import { Injectable, NotFoundException } from "@nestjs/common";
import { Contest, ContestRuleType, ContestantStatus, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { ContestCreateDto } from "./dto/contest-create.dto";
import { CurrentAuthService } from "src/auth/current-auth.service";
import { ContestDao } from "./contest.dao";

@Injectable()
export class ContestService {
    constructor(
        private currentAuthService: CurrentAuthService,
        private contestDao: ContestDao,
        private prisma: PrismaService
    ) {}

    public async createContest(
        contestCreateDto: ContestCreateDto
    ): Promise<Contest> {
        const currentUser: User = this.currentAuthService.currentUser();
        const newContest = this.contestDao.new();
        contestCreateDto.mapOnto(newContest, currentUser);

        const c = contestCreateDto;

        const contest = await this.prisma.contest.create({
            data: {
                ...newContest,
 
                contestRules: {
                    create: c.contestRules.map( rule => { 
                        return { 
                            ruleType: rule.ruleType 
                        }
                    })
                },

                contestants: {
                    create: {
                        userId: currentUser.id,
                        status: ContestantStatus.IN_CONTEST
                    }
                }
            }
        });

        return contest;
    }

    public async findContest(contestId: number): Promise<Contest> {
        const currentUser: User = await this.currentAuthService.currentUser();
        const contest = await this.prisma.contest.findFirst({
            where: {
                AND: [
                    {
                        id: contestId,
                    },
                    this.contestVisibleConditions(currentUser.id)
                ]
            }
        });

        if (contest == null) {
            throw new NotFoundException("Contest not found for given id. The contest doesn't exist or you don't have access to see it.");
        }

        return contest as Contest;
    }

    public async findAllContests(): Promise<Contest[]> {
        const currentUser: User = await this.currentAuthService.currentUser();
        const contests = await this.prisma.contest.findMany({
            where: this.contestVisibleConditions(currentUser.id)
        });

        return contests as Contest[];
    }

    private contestVisibleConditions(currentUserId: bigint) {
        return {
            OR: [
                this.conditionUserInContest(currentUserId),
                this.conditionUserIsOwner(currentUserId),
                this.conditionFriendOfOwner(currentUserId),
                // this.conditionFiendOfFriend(currentUserId),
            ]
        }
    }

    private conditionUserInContest(currentUserId: bigint) {
        return {
            contestants: {
                some: {
                    status: {
                        notIn: [ ContestantStatus.LEFT, ContestantStatus.REMOVED ]
                    },
                    user: {
                        id: currentUserId,
                    }
                }
            }
        };
    }

    private conditionUserIsOwner(currentUserId: bigint) {
        return {
            userId: currentUserId
        };
    }

    private conditionFriendOfOwner(currentUserId: bigint) {
        return {
            contestRules: {
                some: {
                    ruleType: ContestRuleType.JOINING_FRIEND_OF_OWNER
                }
            },
            user: {
                friends: {
                    some: {
                        friendId: currentUserId
                    }
                }
            }
        };
    }

    // private conditionFiendOfFriend(currentUserId: bigint) {
    //     return {
    //         contestRules: {
    //             some: {
    //                 ruleType: ContestRuleType.JOINING_FRIEND_OF_CONTESTANT
    //             }
    //         },
    //         contestants: {
    //             some: {
    //                 user: {
    //                     some: {
    //                         friends: {
    //                             some: {
    //                                 friendId: currentUserId
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     };
    // }
}