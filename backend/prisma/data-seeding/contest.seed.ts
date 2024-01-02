// import { PrismaClient, Prisma, Contest, User, ContestantStatus } from "@prisma/client";
// import { GeneratedData, Seeder } from "./seeder";
// import { faker } from "@faker-js/faker";

// export class ContestSeeder implements Seeder {
//     info(): string {
//         return 'Contests';
//     }

//     async seed(
//         prisma: PrismaClient, 
//         generatedData: GeneratedData
//     ): Promise<any> {
//         for(let i = 0; i < 10; i++) {
//             const contest = await this.createContest(prisma, generatedData.users);
//             generatedData.contests.push(contest);
//         }
//     }

//     private async createContest(prisma: PrismaClient, users: User[]): Promise<Contest> {
//         return prisma.contest.create({
//             data: {
//                 publishTime: new Date(Date.now() - 3600000),
//                 startTime: new Date(Date.now() - 10000),
//                 endTime: new Date(Date.now() + (1000 * 3600 * 24 * 7)),
//                 name: faker.animal.cat(),
//                 description: faker.commerce.productDescription(),
//                 contestants: {
//                     create: users.map((user) => {
//                         return {
//                             userId: user.id,
//                             status: ContestantStatus.JOINED
//                         }
//                     })
//                 }
//             }
//         });
//     }

//     private async draftContest(prisma: PrismaClient, users: User[]) { }
//     private async prePublishedContest(prisma: PrismaClient, users: User[]) { }
//     private async pendingContest(prisma: PrismaClient, users: User[]) { }
//     private async activeContest(prisma: PrismaClient, users: User[]) { }
//     private async contestEndingSoon(prisma: PrismaClient, users: User[]) { }
//     private async recentlyEndedContest(prisma: PrismaClient, users: User[]) { }
//     private async oldContest(prisma: PrismaClient, users: User[]) { }
// }