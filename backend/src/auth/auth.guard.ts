import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './auth.decorator';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtDto } from './dto/auth.jwt.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    if (this.isPublicEndpoint(context)) {
      return true;
    }

    await this.authenticateUser(context);
    return true;
  }

  // -- PRIVATE --

  private isPublicEndpoint(context: ExecutionContext) : boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
  }

  private async authenticateUser(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.authToken(request);
    const payload = this.validateAuthToken(token);

    const user = await this.authService.getUserForAuthToken(token, payload);
    if (!user) {
      throw new UnauthorizedException(); // revoked token
    }
    request['user'] = user;
  }

  private authToken(request: Request): string {
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    return token
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = (<any>request.headers).authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private validateAuthToken(authToken: string): AuthJwtDto {
    try {
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      return this.jwtService.verify(authToken, {
        secret: jwtSecret
      });
    } catch(_e) {
      throw new UnauthorizedException();
    }
  }
}
