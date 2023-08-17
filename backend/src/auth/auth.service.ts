import { NotFoundException, ForbiddenException, Injectable } from '@nestjs/common';
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

        return this.createTokenForUser(user);
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

    async refreshAuthentication(refreshToken: string): Promise<AuthResultDto> {
        const refreshTokenInformation = await this.prismaService.userAuthToken.findFirst({
            where: {
                refreshToken: refreshToken
            },
            include: {
                user: true
            }
        });

        if (!refreshTokenInformation) {
            throw new NotFoundException("No refresh token found");
        }

        await this.destroyTokenByRefreshToken(refreshToken);
        return this.createTokenForUser(refreshTokenInformation.user);
    }

    async destroyTokenByRefreshToken(refreshToken: string): Promise<undefined> {
        await this.prismaService.userAuthToken.delete({
            where: {
                refreshToken: refreshToken
            }
        });
    }

    // PRIVATE //

    private signToken(userId: bigint, email: string): Promise<string> {
        const payload: AuthJwtDto = {
            sub: userId,
            email: email,
        }

        const secret = this.configService.get<string>('JWT_SECRET');
        const tokenLifespan = this.configService.get<string>('JWT_TOKEN_LIFE');

        return this.jwtService.signAsync(payload, {
            expiresIn: tokenLifespan,
            secret
        })
    }

    private async assertUserPasswordMatch(auth: UserAuth, password: string) {
        const matchedPassword = await argon.verify(auth.hash, password);
        if (!matchedPassword) {
            throw new ForbiddenException('Incorrect login information');
        }
    }

    private async createTokenForUser(user: User): Promise<AuthResultDto> {
        const jwtToken = await this.signToken(user.id, user.email);

        return {
            userId: user.id,
            jwtToken: jwtToken,
            refreshToken: await this.createRefreshToken(user.id, jwtToken)
        }
    }

    private async createRefreshToken(userId: bigint, jwtToken: string) {
        const uuid = uuidv4();

        const expiration = new Date();
        expiration.setDate(expiration.getDate() + 14);

        await this.prismaService.userAuthToken.create({
            data: {
                userId: userId,
                accessToken: jwtToken,
                refreshToken: uuid,
                expiresAt: expiration,
            }
        });

        return uuid;
    }
}
