import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression  } from "@nestjs/schedule";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthCleanupService {
    constructor(
        private prismaService: PrismaService
    ) {}
    
    private readonly logger = new Logger(AuthCleanupService.name)

    @Cron(CronExpression.EVERY_DAY_AT_2AM)
    async removeExpiredAuth() {
        this.logger.debug('Running job to remove expired refresh tokens');

        const batch = await this.prismaService.userAuthToken.deleteMany({
            where: {
                expiresAt: {
                    lte: new Date()
                }
            }
        });

        this.logger.debug(`Job to remove expired refresh tokens finished: ${batch.count} records removed`);
    }
}