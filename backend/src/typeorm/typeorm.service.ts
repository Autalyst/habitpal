import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UserAuth } from 'src/user/auth/entity/user-auth.entity';
import { UserAuthToken } from 'src/user/auth/entity/user-auth-token.entity';

@Injectable()
export class TypeOrmService {
    private dataSourcePromise: Promise<DataSource>;

    constructor(configService: ConfigService) {
        this.dataSourcePromise = new DataSource({
            type: 'postgres',
            url: configService.getOrThrow('DATABASE_URL'),
            entities: [User, UserAuth, UserAuthToken],
            synchronize: true,
            logging: false
        }).initialize();
    }

    datasource(): Promise<DataSource> {
        return this.dataSourcePromise;
    }
}