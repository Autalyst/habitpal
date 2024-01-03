import { DATA_SOURCE } from "src/util/providers.constants";
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