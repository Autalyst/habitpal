import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
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
import { DeleteResult } from 'typeorm';

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

    async deleteAllAuthorization(userId: number): Promise<DeleteResult> {
        return this.authTokenDao.delete({
            user: {
                id: userId
            }
        });
    }

    async deleteAuthorizationById(authTokenId: number, userId: number): Promise<DeleteResult> {
        return this.authTokenDao.delete({
            id: authTokenId,
            user: {
                id: userId
            }
        });
    }

    async refreshAuthorization(refreshToken: string): Promise<AuthResultDto> {
        const existingToken = await this.getMatchingDatabaseToken(refreshToken);
        const user = await this.userDao.findOne({
            id: existingToken.user.id
        });

        const newToken = await this.createTokenForUser(user);

        await this.authTokenDao.delete({
            id: existingToken.id
        });

        return newToken;
    }

    private async getMatchingDatabaseToken(refreshToken: string): Promise<UserAuthToken> {
        const token = this.decodeRefreshToken(refreshToken);

        const existingAuthTokens = await this.authTokenDao.find({
            user: {
                id: Number(token.sub)
            },
        }, {
            user: true
        });

        for (const dbToken of existingAuthTokens) {
            // NOTE: This is very slow, but no way to generate the hash beforehand that I know of right now
            const match = await argon.verify(dbToken.refreshTokenHash, refreshToken);
            if (match) {
                return dbToken;
            }
        }

        throw new UnauthorizedException();
    }

    private decodeRefreshToken(refreshToken: string): AuthJwtDto {
        try {
            const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
            return this.jwtService.verify(refreshToken, {
                secret: refreshSecret
            });
        } catch(_e) {
            throw new UnauthorizedException();
        }
    }

    private async assertPasswordMatch(user: User, password: string) {
        const matchedPassword = await argon.verify(user.auth.hash, password);
        if (!matchedPassword) {
            throw new ForbiddenException('Incorrect login information');
        }
    }

    private async createTokenForUser(user: User): Promise<AuthResultDto> {
        const jwtPayload: AuthJwtDto = {
            sub: user.id.toString(),
            email: user.email
        };

        const jwtToken = this.signAuthToken(jwtPayload);
        const refreshToken = this.signRefreshToken(jwtPayload);

        await this.persistRefreshToken(user, refreshToken);

        return {
            id: -1, // TODO: Remove, or figure out if needed at all
            userId: user.id,
            jwtToken: jwtToken,
            refreshToken: refreshToken
        }
    }

    private signAuthToken(payload: AuthJwtDto): string {
        const secret = this.configService.get<string>('JWT_SECRET');
        const tokenLifespan = this.configService.get<string>('JWT_TOKEN_LIFE');

        return this.createSignedToken(payload, secret, tokenLifespan);
    }

    private signRefreshToken(payload: AuthJwtDto): string {
        const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
        const tokenLifespan = this.configService.get<string>('JWT_REFRESH_TOKEN_LIFE');

        return this.createSignedToken(payload, secret, tokenLifespan);
    }

    private createSignedToken(payload: any, secret: string, lifespan: string): string {
        return this.jwtService.sign(payload, {
            expiresIn: lifespan,
            secret
        });
    }

    private async persistRefreshToken(user: User, refreshToken: string): Promise<UserAuthToken> {
        const expiration = new Date();
        expiration.setDate(expiration.getDate() + 14); // use this.configService.get<string>('JWT_REFRESH_TOKEN_LIFE')
        
        const refreshTokenHash = await argon.hash(refreshToken);

        const userAuthToken =  new UserAuthToken();
        userAuthToken.user = user;
        userAuthToken.refreshTokenHash = refreshTokenHash;
        userAuthToken.expiresAt = expiration;

        await this.authTokenDao.save(userAuthToken);

        return userAuthToken;
    }
}
