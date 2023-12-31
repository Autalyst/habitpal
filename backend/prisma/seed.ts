import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { UserSeeder } from './data-seeding/user.seed';
import { GeneratedData, Seeder } from './data-seeding/seeder';
import { ContestSeeder } from './data-seeding/contest.seed';

const prisma = new PrismaClient();
const generatedData = new GeneratedData();

const seeders: Seeder[] = [
    new UserSeeder(),
    new ContestSeeder(),
]

async function main() {
    dotenv.config();
    console.log('Seeding database...');

    for (const seeder of seeders) {
        console.log(`* Seeding ${seeder.info()}`);
        await seeder.seed(prisma, generatedData);
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