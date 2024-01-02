import { Injectable } from "@nestjs/common";
import { FindOptionsRelations, FindOptionsWhere, LessThan, Repository } from "typeorm";
import { UserAuthToken } from "./entity/user-auth-token.entity";
import { TypeOrmService } from "src/typeorm/typeorm.service";

@Injectable()
export class UserAuthTokenDao {
    private userAuthTokenRepository: Promise<Repository<UserAuthToken>>;

    constructor(typeOrmService: TypeOrmService) {
        this.userAuthTokenRepository = new Promise((resolve, reject) => {
            typeOrmService.datasource().then((dataSource) => {
                resolve(dataSource.getRepository(UserAuthToken))
            }).catch(() => {
                reject();
            });
        });
    }

    async save(userAuthToken: UserAuthToken): Promise<UserAuthToken> {
        const repo = await this.userAuthTokenRepository;
        return await repo.save(userAuthToken);
    }

    async findOne(
        condition: FindOptionsWhere<UserAuthToken>,
        relations: FindOptionsRelations<UserAuthToken> = {}
    ): Promise<UserAuthToken> {
        const repo = await this.userAuthTokenRepository;
        return repo.findOne({
            where: condition,
            relations: relations
        });
    }

    async deleteExpired(): Promise<Number> {
        const repo = await this.userAuthTokenRepository;

        const expired = await repo.find({
            where: {
                expiresAt: LessThan(new Date())
            }
        });

        const count = expired.length;

        await repo.remove(expired);

        return count;
    }
}