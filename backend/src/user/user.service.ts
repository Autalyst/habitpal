import { ForbiddenException, Injectable } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import { User, Prisma } from '@prisma/client';
import { UserCreateDto } from './dto/user-create.dto';

import * as argon from 'argon2';
import { UserDao } from './user.dao';
import { User } from './entity/user.entity';
import { UserAuth } from './auth/entity/user-auth.entity';

@Injectable()
export class UserService {
    constructor(private userDao: UserDao) {}

    async createUser(userCreateDto: UserCreateDto): Promise<User> {
        const user = new User();
        user.email = userCreateDto.email;

        user.auth = new UserAuth();
        user.auth.hash = await argon.hash(userCreateDto.password);

        return this.userDao.saveUser(user);
    }

    // async findUser(userId: string): Promise<User> {
    //     return this.prisma.user.findUnique({
    //         where: {
    //             id: userId
    //         }
    //     });
    // }
}
