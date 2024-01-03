import { Inject, Injectable } from "@nestjs/common";
import { FindOptionsRelations, FindOptionsWhere, LessThan, Repository } from "typeorm";
import { UserAuthToken } from "./user-auth-token.entity";
import { USER_AUTH_TOKEN_REPOSITORY } from "./user-auth-token.provider";

@Injectable()
export class UserAuthTokenDao {
    constructor(
        @Inject(USER_AUTH_TOKEN_REPOSITORY)
        private repo: Repository<UserAuthToken>
    ) { }

    save(userAuthToken: UserAuthToken): Promise<UserAuthToken> {
        return this.repo.save(userAuthToken);
    }

    findOne(
        condition: FindOptionsWhere<UserAuthToken>,
        relations: FindOptionsRelations<UserAuthToken> = {}
    ): Promise<UserAuthToken> {
        return this.repo.findOne({
            where: condition,
            relations: relations
        });
    }

    async deleteExpired(): Promise<Number> {
        const expired = await this.repo.find({
            where: {
                expiresAt: LessThan(new Date())
            }
        });

        const count = expired.length;

        await this.repo.remove(expired);

        return count;
    }
}