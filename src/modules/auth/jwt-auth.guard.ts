import {
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { RefreshTokenService } from '../refresh_token/refresh_token.service';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    @Inject(RefreshTokenService)
    private readonly refreshTokenService: RefreshTokenService,
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {
    super();
  }

  private readonly logger = new Logger(JwtAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromRequest(request);
      const refreshToken = this.extractRefreshTokenFromCookie(request);

      if (!token) throw new UnauthorizedException('No token provided');

      await this.authService.compareToken(token, refreshToken);
      await this.refreshTokenService.verifyRefreshToken(refreshToken);

      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        });
        request['user'] = payload;
      } catch {
        throw new UnauthorizedException('Invalid token');
      }

      return true;
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    const cookieToken = request.cookies['jwt'];

    if (cookieToken) return cookieToken;

    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    console.log('token', token);
    return type === 'Bearer' ? token : undefined;
  }

  private extractRefreshTokenFromCookie(request: any): string | undefined {
    console.log('refresh token', request.headers.cookies);

    // return getCookieValue(request.headers.cookies, 'refreshToken');
    return request.headers.cookies;
  }
}
