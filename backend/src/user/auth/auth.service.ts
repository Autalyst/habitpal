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
import { UserCurrentAuthService } from './current-auth.service';
import { DeleteResult } from 'typeorm';

@Injectable()
export class UserAuthService {
    constructor(
        private configService: ConfigService,
        private userDao: UserDao,
        private jwtService: JwtService,
        private authTokenDao: UserAuthTokenDao,
        private currentAuthService: UserCurrentAuthService,
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
            id: Number(jwtPayload.sub),
            authToken: {
                jwtToken: token,
            }
        });

        return user
    }

    async deleteAllAuthorization(): Promise<DeleteResult> {
        const user = this.currentAuthService.currentUser();
        return this.authTokenDao.delete({
            user: {
                id: user.id
            }
        });
    }

    async deleteAuthorizationById(authTokenId: number): Promise<DeleteResult> {
        const user = this.currentAuthService.currentUser();

        return this.authTokenDao.delete({
            id: authTokenId,
            user: {
                id: user.id
            }
        });
    }

    private async assertPasswordMatch(user: User, password: string) {
        const matchedPassword = await argon.verify(user.auth.hash, password);
        if (!matchedPassword) {
            throw new ForbiddenException('Incorrect login information');
        }
    }

    private async createTokenForUser(user: User): Promise<AuthResultDto> {
        const jwtToken = await this.signToken(user.id, user.email);
        const refreshToken = await this.createRefreshToken(user, jwtToken);

        return {
            id: refreshToken.id,
            userId: user.id,
            jwtToken: refreshToken.jwtToken,
            refreshToken: refreshToken.refreshToken
        }
    }

    private signToken(userId: number, email: string): Promise<string> {
        const payload: AuthJwtDto = {
            sub: userId.toString(),
            email: email,
        }

        const secret = this.configService.get<string>('JWT_SECRET');
        const tokenLifespan = this.configService.get<string>('JWT_TOKEN_LIFE');

        return this.jwtService.signAsync(payload, {
            expiresIn: tokenLifespan,
            secret
        })
    }

    private async createRefreshToken(user: User, jwtToken: string): Promise<UserAuthToken> {
        const expiration = new Date();
        expiration.setDate(expiration.getDate() + 14);

        const userAuthToken = new UserAuthToken();
        userAuthToken.user = user;
        userAuthToken.jwtToken = jwtToken;
        userAuthToken.expiresAt = expiration;

        await this.authTokenDao.save(userAuthToken);

        return userAuthToken;
    }
}
