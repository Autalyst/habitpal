import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression  } from "@nestjs/schedule";
import { UserAuthTokenDao } from "./auth-token.dao";

@Injectable()
export class UserAuthCleanupService {
    constructor(
        private userAuthTokenDao: UserAuthTokenDao
    ) {}
    
    private readonly logger = new Logger(UserAuthCleanupService.name)

    @Cron(CronExpression.EVERY_DAY_AT_2PM)
    async removeExpiredAuth() {
        this.logger.debug('Running job to remove expired refresh tokens');

        const deletedItems = await this.userAuthTokenDao.deleteExpired();

        this.logger.debug(`Job to remove expired refresh tokens finished: ${deletedItems} records removed`);
    }
}