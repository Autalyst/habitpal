import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import { FindOptionsRelations, FindOptionsWhere, Repository } from "typeorm";
import { USER_REPOSITORY } from "./user.provider";

@Injectable()
export class UserDao {
    constructor(
        @Inject(USER_REPOSITORY)
        private repo: Repository<User>
    ) { }

    async save(user: User): Promise<User> {
        try {
            return await this.repo.save(user);
        } catch(e) {
            if (e.detail.includes("already exists")) {
                throw new HttpException('Email in use', HttpStatus.BAD_REQUEST);
            }
        }
    }

    async findOne(
        condition: FindOptionsWhere<User>,
        relations: FindOptionsRelations<User> = {}
    ): Promise<User> {
        return this.repo.findOne({
            where: condition,
            relations: relations
        });
    }
}