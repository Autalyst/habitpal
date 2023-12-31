import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { UserCreateDto } from './dto/user-create.dto';

import * as argon from 'argon2';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async createUser(userCreateDto: UserCreateDto): Promise<User> {
        try {
            return this.prisma.user.create({
                data: {
                    email: userCreateDto.email,
                    userAuth: {
                        create: {
                            hash: await argon.hash(userCreateDto.password)
                        }
                    }
                }
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Email address is unavailable');
                }
            }
        }
    }

    async findUser(userId: string): Promise<User> {
        return this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
    }
}
