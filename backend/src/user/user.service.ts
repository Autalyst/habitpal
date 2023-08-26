import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Organization, User } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async createUser(organization: Organization, email: string): Promise<User> {
        try {
            return await this.prisma.user.create({
                data: {
                    organizationId: organization.id,
                    email: email,
                }
            });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Email address is unavailable');
                }
            }
        }
    }
}
