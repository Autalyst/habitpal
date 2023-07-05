import { PrismaClient, User } from '@prisma/client';
import { faker } from '@faker-js/faker'
import * as dotenv from 'dotenv';
import * as argon from 'argon2';

const prisma = new PrismaClient()

async function makeUser(): Promise<User> {
    const hash = await argon.hash('asdfghjk');
    return prisma.user.create({
        data: {
            email: faker.internet.email(),
            userAuth: {
                create: {
                    hash: hash,
                }
            }
        }
    })
}

async function main() {
    const userCount = 10;
    dotenv.config();
    console.log('Seeding database...');

    for (let i = 0; i < userCount; i++) {
        await makeUser();
    }

    console.log('Done!');
}

main()
    .catch(async (e) => {
        console.error(e);
        process.exit(1);
    }).finally(async () => {
        await prisma.$disconnect();
    });