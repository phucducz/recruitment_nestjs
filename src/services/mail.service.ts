import { MailerService } from '@nestjs-modules/mailer';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { BLOCK_TIME, MAX_SEND_COUNT } from 'src/common/utils/constants';
import { UNAUTHORIZED_EXCEPTION_MESSAGE } from 'src/common/utils/enums';
import { SendSignUpVerificationEmailDto } from 'src/dto/mail/send-verify-email.dto';
import { VerifySignUpTokenDto } from 'src/dto/mail/verify-email-sign-up.dto';

@Injectable()
export class MailService {
  constructor(
    @Inject(ConfigService) private configService: ConfigService,
    @Inject(MailerService) private readonly mailerService: MailerService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  private readonly pendingVerifycations = new Map<
    string,
    IPendingVerification
  >();

  async generateVerifyEmailSignUpToken(
    sendSignUpVerificationEmailDto: SendSignUpVerificationEmailDto,
  ) {
    const oldPendingVerification = this.pendingVerifycations.get(
      sendSignUpVerificationEmailDto.email,
    );
    let sendCount = 1;

    this.log();

    if (oldPendingVerification) {
      const timeSinceLastSend = Date.now() - oldPendingVerification.lastSentAt;

      if (
        oldPendingVerification.sendCount >= MAX_SEND_COUNT &&
        timeSinceLastSend < BLOCK_TIME
      )
        throw new Error(
          `Bạn đã yêu xác thực quá nhiều lần, vui lòng đợi 15 phút sau để có thể gửi yêu cầu mới!`,
        );

      if (timeSinceLastSend >= BLOCK_TIME) sendCount = 1;
      else sendCount = oldPendingVerification.sendCount + 1;
    }

    const token = await this.jwtService.signAsync(
      { ...sendSignUpVerificationEmailDto },
      { expiresIn: '24h' },
    );

    this.pendingVerifycations.set(sendSignUpVerificationEmailDto.email, {
      token,
      attemptCount: 0,
      sendCount,
      lastSentAt: Date.now(),
    });

    this.log();

    return token;
  }

  log() {
    console.log(this.pendingVerifycations);
  }

  async verifySignUpToken(verifySignUpTokenDto: VerifySignUpTokenDto) {
    const verificationData = this.pendingVerifycations.get(
      verifySignUpTokenDto.email,
    );

    if (!verificationData) throw new NotFoundException('Không tìm thấy token');

    const { token } = verificationData;

    if (token !== verifySignUpTokenDto.token)
      throw new UnauthorizedException(
        UNAUTHORIZED_EXCEPTION_MESSAGE.INVALID_TOKEN,
      );

    try {
      await this.jwtService.verifyAsync(verifySignUpTokenDto.token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch {
      throw new UnauthorizedException(
        UNAUTHORIZED_EXCEPTION_MESSAGE.TOKEN_EXPIRED,
      );
    }

    return token;
  }

  deleteSignUpToken(email: string) {
    this.pendingVerifycations.delete(email);
  }

  async sendOTPEmail(email: string, otp: number) {
    await this.mailerService.sendMail({
      to: email,
      subject: `Mã đăng nhập tài khoản Recruitment Web App: ${otp}`,
      text: `Your OTP code is ${otp}`,
      template: './sendOTP',
      context: {
        otp,
        web_app_url: this.configService.get<string>('CLIENT_URL'),
      },
    });
  }

  async sendResetPasswordURL(
    email: string,
    params: {
      email: string;
      fullName: string;
      token: string;
    },
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Đặt lại mật khẩu cho tài khoản Recruitment Web App',
      template: './resetPassword',
      context: {
        full_name: params.fullName,
        action_url: `${this.configService.get<string>('CLIENT_URL')}/user/reset-password?email=${params.email}&token=${params.token}`,
        local_url: `http://localhost:5173/user/reset-password?email=${params.email}&token=${params.token}`,
        web_app_url: this.configService.get<string>('CLIENT_URL'),
      },
    });
  }

  async sendSignUpVerificationEmailURL(
    email: string,
    params: {
      token: string;
      fullName: string;
    },
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Xác thực tài khoản Recruitment Web App',
      template: './sendVerifyEmail',
      context: {
        full_name: params.fullName,
        action_url: `${this.configService.get<string>('CLIENT_URL')}/verify-email?email=${email}&token=${
          params.token
        }`,
        web_app_url: this.configService.get<string>('CLIENT_URL'),
      },
    });
  }
}
