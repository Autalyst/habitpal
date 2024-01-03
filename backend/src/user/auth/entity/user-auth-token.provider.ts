import { DATA_SOURCE } from "src/util/providers.constants";
import { UserAuthToken } from "./user-auth-token.entity";
import { DataSource } from "typeorm";

export const USER_AUTH_TOKEN_REPOSITORY = 'USER_AUTH_TOKEN_REPOSITORY';

export const UserAuthTokenProviders = [
    {
        provide: USER_AUTH_TOKEN_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(UserAuthToken),
        inject: [DATA_SOURCE]
    }
]