import { DATA_SOURCE } from "src/typeorm/database.providers";
import { DataSource } from "typeorm";
import { User } from "./user.entity";

export const USER_REPOSITORY = 'USER_REPOSITORY';

export const UserProviders = [
    {
        provide: USER_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
        inject: [DATA_SOURCE],
    }
];