import { ConfigService } from '@nestjs/config';
import { UserAuthToken } from 'src/user/auth/entity/user-auth-token.entity';
import { UserAuth } from 'src/user/auth/entity/user-auth.entity';
import { User } from 'src/user/entity/user.entity';
import { DATA_SOURCE } from 'src/util/providers.constants';
import { DataSource } from 'typeorm';

export const databaseProviders = [
    {
        provide: DATA_SOURCE,
        useFactory: async (configService: ConfigService) => {
            return new DataSource({
                type: 'postgres',
                url: configService.getOrThrow('DATABASE_URL'),
                entities: [User, UserAuth, UserAuthToken],
                synchronize: true,
                logging: false
            }).initialize();
        },
        inject: [ConfigService]
    }
]