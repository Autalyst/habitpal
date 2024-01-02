// import { PrismaClient, User } from "@prisma/client";
// import { GeneratedData, Seeder } from "./seeder";
// import * as argon from 'argon2';
// import { faker } from "@faker-js/faker";

// export class UserSeeder implements Seeder {
//     info(): string {
//         return 'Users';
//     }

//     async seed(
//         prisma: PrismaClient, 
//         generatedData: GeneratedData
//     ): Promise<any> {
//         const devUser = await this.createUser('dev@habit.com', prisma);
//         generatedData.users.push(devUser);

//         for(let i = 0; i < 9; i++) {
//             const user = await this.createUser(faker.internet.email(), prisma);
//             generatedData.users.push(user);
//         }
//     }

//     private async createUser(email: string, prisma: PrismaClient): Promise<User> {
//         const hash = await argon.hash('asdfghjk');
//         return prisma.user.create({
//             data: {
//                 email: email,
//                 userAuth: {
//                     create: {
//                         hash: hash
//                     }
//                 }
//             }
//         });
//     }
// }