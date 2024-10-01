import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import {
  FORGOT_PASSWORD_TOKEN_STATUS,
  UNAUTHORIZED_EXCEPTION_MESSAGE,
} from 'src/common/utils/enums';

@Injectable()
export class ForgotPasswordService {
  constructor(
    private configService: ConfigService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  private forgotPasswordToken = new Map<string, FORGOT_PASSWORD_TOKEN_STATUS>();

  async generate(userId: number) {
    const token = await this.jwtService.signAsync(
      {
        userId,
        type: 'forgot-password',
      },
      { expiresIn: '15m' },
    );

    this.forgotPasswordToken.set(token, FORGOT_PASSWORD_TOKEN_STATUS.VALID);

    return token;
  }

  async verify(token: string) {
    const status = this.forgotPasswordToken.get(token);

    if (!status || (status && status === FORGOT_PASSWORD_TOKEN_STATUS.INVALID))
      throw new UnauthorizedException(
        UNAUTHORIZED_EXCEPTION_MESSAGE.INVALID_TOKEN,
      );

    const tokenDecoded = this.jwtService.decode(token);

    try {
      await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException('Token đã hết hạn');
    }

    if (!tokenDecoded?.type || !tokenDecoded?.userId)
      throw new BadRequestException('Không tìm thấy người dùng');

    if (tokenDecoded.type !== 'forgot-password')
      throw new UnauthorizedException(
        UNAUTHORIZED_EXCEPTION_MESSAGE.INVALID_TOKEN,
      );

    return tokenDecoded.userId;
  }

  delete(token: string) {
    this.forgotPasswordToken.delete(token);
    return true;
  }

  log() {
    console.log(this.forgotPasswordToken);
  }
}
