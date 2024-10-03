import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { BLOCK_TIME, MAX_SEND_COUNT } from 'src/common/utils/constants';
import { UNAUTHORIZED_EXCEPTION_MESSAGE } from 'src/common/utils/enums';
import { VerifyResetPasswordTokenDto } from 'src/dto/users/verify-forgot-password-token.dto';

@Injectable()
export class ResetPasswordService {
  constructor(
    private configService: ConfigService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  private resetPasswordToken = new Map<string, IForgotPassword>();

  async generate(payload: { userId: number; email: string }) {
    const { email } = payload;
    const oldResetPasswordToken = this.resetPasswordToken.get(email);
    let sendCount = 1;

    if (oldResetPasswordToken) {
      const timeSinceLastSend = Date.now() - oldResetPasswordToken.lastSentAt;

      if (
        oldResetPasswordToken.sendCount >= MAX_SEND_COUNT &&
        timeSinceLastSend < BLOCK_TIME
      )
        throw new Error(
          `Bạn đã yêu quá nhiều lần, vui lòng đợi 15 phút sau để có thể gửi yêu cầu mới!`,
        );

      if (timeSinceLastSend >= BLOCK_TIME) sendCount = 0;
      else sendCount = oldResetPasswordToken.sendCount + 1;
    }

    const token = await this.jwtService.signAsync(
      { ...payload },
      { expiresIn: '15m' },
    );

    this.resetPasswordToken.set(email, {
      token,
      attemptCount: 0,
      lastSentAt: Date.now(),
      sendCount,
    });

    return token;
  }

  async verify(verifyResetPasswordTokenDto: VerifyResetPasswordTokenDto) {
    const verifyForgotPasswordTokenData = this.resetPasswordToken.get(
      verifyResetPasswordTokenDto.email,
    );

    if (!verifyForgotPasswordTokenData)
      throw new UnauthorizedException(
        UNAUTHORIZED_EXCEPTION_MESSAGE.INVALID_TOKEN,
      );

    const { token } = verifyForgotPasswordTokenData;
    const tokenDecoded = this.jwtService.decode(token);

    if (token !== verifyResetPasswordTokenDto.token)
      throw new UnauthorizedException(
        UNAUTHORIZED_EXCEPTION_MESSAGE.INVALID_TOKEN,
      );

    try {
      await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException('Token đã hết hạn');
    }

    if (!tokenDecoded?.userId)
      throw new BadRequestException('Không tìm thấy người dùng');

    return tokenDecoded.userId;
  }

  delete(token: string) {
    this.resetPasswordToken.delete(token);
    return true;
  }

  log() {
    console.log(this.resetPasswordToken);
  }
}
