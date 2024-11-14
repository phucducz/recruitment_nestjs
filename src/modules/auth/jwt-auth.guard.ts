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
import { UNAUTHORIZED_EXCEPTION_MESSAGE } from 'src/common/utils/enums';

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

      if (!token)
        throw new UnauthorizedException(UNAUTHORIZED_EXCEPTION_MESSAGE.NO_PROVIDED_TOKEN);

      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        });

        request['user'] = payload;
      } catch {
        throw new UnauthorizedException(UNAUTHORIZED_EXCEPTION_MESSAGE.TOKEN_EXPIRED);
      }

      await this.authService.compareToken(token, refreshToken);
      await this.refreshTokenService.verifyRefreshToken(refreshToken);

      return true;
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException(error);
    }
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    const cookieToken = request.cookies['jwt'];

    if (cookieToken) return cookieToken;

    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractRefreshTokenFromCookie(request: any): string | undefined {
    return request.headers.cookies;
  }
}
