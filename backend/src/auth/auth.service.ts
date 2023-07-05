import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRequestDto } from './dto/auth.request.dto';
import { User, UserAuth } from '@prisma/client';
import { AuthResultDto } from './dto/auth.result.dto';
import { v4 as uuidv4 } from 'uuid';

import * as argon from 'argon2';
import { AuthJwtDto } from './dto/auth.jwt.dto';

@Injectable()
export class AuthService {
    constructor(
        private configService: ConfigService,
        private prismaService: PrismaService,
        private jwtService: JwtService,
    ) {}

    async authorize(authRequestDto: AuthRequestDto): Promise<AuthResultDto> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: authRequestDto.email
            },
            include: {
                userAuth: true
            }
        });

        if (!user) {
            throw new ForbiddenException('Incorrect login information');
        }

        await this.assertUserPasswordMatch(user.userAuth!, authRequestDto.password);

        return {
            userId: user.id,
            token: await this.signToken(user.id, user.email)
        };
    }

    async createRefreshToken(authInfo: AuthResultDto) {
        const uuid = uuidv4();

        const expiration = new Date();
        expiration.setDate(expiration.getDate() + 14);

        await this.prismaService.userAuthToken.create({
            data: {
                userId: authInfo.userId,
                accessToken: authInfo.token,
                refreshToken: uuid,
                expiresAt: expiration,
            }
        });

        return uuid;
    }

    async getUserForAuthToken(token: string, jwtPayload: AuthJwtDto): Promise<User | null | undefined> {
        const userAuth = await this.prismaService.userAuthToken.findFirst({
            where: {
                accessToken: token,
                userId: BigInt(jwtPayload.sub)
            },
            include: {
                user: true
            }
        });

        return userAuth?.user
    }

    // PRIVATE //

    private signToken(userId: bigint, email: string): Promise<string> {
        const payload: AuthJwtDto = {
            sub: userId,
            email: email,
        }

        const secret = this.configService.get<string>('JWT_SECRET');

        return this.jwtService.signAsync(payload, {
            expiresIn: '10m',
            secret
        })
    }

    private async assertUserPasswordMatch(auth: UserAuth, password: string) {
        const matchedPassword = await argon.verify(auth.hash, password);
        if (!matchedPassword) {
            throw new ForbiddenException('Incorrect login information');
        }
    }
}
