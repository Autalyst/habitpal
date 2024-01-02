import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { TypeOrmService } from "src/typeorm/typeorm.service";
import { User } from "./entity/user.entity";
import { FindOptionsRelations, FindOptionsWhere, Repository } from "typeorm";

@Injectable()
export class UserDao {
    private userRepository: Promise<Repository<User>>;

    constructor(typeOrmService: TypeOrmService) {
        this.userRepository = new Promise((resolve, reject) => {
            typeOrmService.datasource().then((dataSource) => {
                resolve(dataSource.getRepository(User))
            }).catch(() => {
                reject();
            });
        });
    }

    async saveUser(user: User): Promise<User> {
        const repo = await this.userRepository;
        try {
            return await repo.save(user);
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
        const repo = await this.userRepository;
        return repo.findOne({
            where: condition,
            relations: relations
        });
    }
}