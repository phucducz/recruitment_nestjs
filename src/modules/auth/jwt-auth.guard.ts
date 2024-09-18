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

import { getCookieValue } from 'src/common/utils/cookie.utils';
import { RefreshTokenService } from '../refresh_token/refresh_token.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    @Inject(RefreshTokenService)
    private readonly refreshTokenService: RefreshTokenService,
  ) {
    super();
  }

  private readonly logger = new Logger(JwtAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const canActivateResult = (await super.canActivate(context)) as boolean;

      if (!canActivateResult) throw new UnauthorizedException();

      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      const refreshToken = getCookieValue(
        request.headers['set-cookie'][0],
        'refreshToken=',
      );

      await this.refreshTokenService.verifyRefreshToken(refreshToken);

      if (!token) throw new UnauthorizedException();

      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        });

        request['user'] = payload;
      } catch {
        throw new UnauthorizedException();
      }

      return true;
    } catch (error) {
      this.logger.log(error);
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
