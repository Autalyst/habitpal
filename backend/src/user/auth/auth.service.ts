import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthRequestDto } from './dto/auth.request.dto';
import { AuthResultDto } from './dto/auth.result.dto';

import * as argon from 'argon2';
import { AuthJwtDto } from './dto/auth.jwt.dto';
import { UserDao } from '../entity/user.dao';
import { User } from '../entity/user.entity';
import { UserAuthToken } from './entity/user-auth-token.entity';
import { UserAuthTokenDao } from './entity/user-auth-token.dao';

@Injectable()
export class UserAuthService {
    constructor(
        private configService: ConfigService,
        private userDao: UserDao,
        private jwtService: JwtService,
        private authTokenDao: UserAuthTokenDao
    ) {}

    async authorize(authRequestDto: AuthRequestDto): Promise<AuthResultDto> {
        const user = await this.userDao.findOne({
            email: authRequestDto.email
        }, { auth: true });

        if (!user) {
            throw new ForbiddenException('Incorrect login information');
        }

        await this.assertPasswordMatch(user, authRequestDto.password);

        return this.createTokenForUser(user);
    }

    async getUserForAuthToken(token: string, jwtPayload: AuthJwtDto): Promise<User | null | undefined> {
        const user = await this.userDao.findOne({
            id: jwtPayload.sub,
            authToken: {
                jwtToken: token,
            }
        });

        return user
    }

    // async refreshAuthentication(auth: AuthResultDto): Promise<AuthResultDto> {
    //     const refreshTokenInformation = await this.prismaService.userAuthToken.findFirst({
    //         where: {
    //             userId: auth.userId,
    //             accessToken: auth.jwtToken,
    //             refreshToken: auth.refreshToken
    //         },
    //         include: {
    //             user: true
    //         }
    //     });

    //     if (!refreshTokenInformation) {
    //         throw new NotFoundException("No refresh token found");
    //     }

    //     await this.destroyUserTokenByRefreshToken(refreshTokenInformation.user, auth.refreshToken);
    //     return this.createTokenForUser(refreshTokenInformation.user);
    // }

    // // PRIVATE //
    // private async destroyUserTokenByRefreshToken(user: User, refreshToken: string): Promise<undefined> {
    //     await this.prismaService.userAuthToken.delete({
    //         where: {
    //             userId: user.id,
    //             refreshToken: refreshToken
    //         }
    //     });
    // }

    private async assertPasswordMatch(user: User, password: string) {
        const matchedPassword = await argon.verify(user.auth.hash, password);
        if (!matchedPassword) {
            throw new ForbiddenException('Incorrect login information');
        }
    }

    private async createTokenForUser(user: User): Promise<AuthResultDto> {
        const jwtToken = await this.signToken(user.id, user.email);

        return {
            userId: user.id,
            jwtToken: jwtToken,
            refreshToken: await this.createRefreshToken(user, jwtToken)
        }
    }

    private signToken(userId: string, email: string): Promise<string> {
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

    private async createRefreshToken(user: User, jwtToken: string) {
        const expiration = new Date();
        expiration.setDate(expiration.getDate() + 14);

        const userAuthToken = new UserAuthToken();
        userAuthToken.user = user;
        userAuthToken.jwtToken = jwtToken;
        userAuthToken.expiresAt = expiration;

        await this.authTokenDao.save(userAuthToken);

        return userAuthToken.refreshToken;
    }
}
