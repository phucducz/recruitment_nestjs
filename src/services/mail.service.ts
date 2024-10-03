import { MailerService } from '@nestjs-modules/mailer';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
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

  private readonly pendingVerifycations = new Map<string, string>();

  async generateVerifyEmailSignUpToken(
    sendSignUpVerificationEmailDto: SendSignUpVerificationEmailDto,
  ) {
    const token = await this.jwtService.signAsync(
      { ...sendSignUpVerificationEmailDto },
      { expiresIn: '24h' },
    );

    this.pendingVerifycations.set(sendSignUpVerificationEmailDto.email, token);

    return token;
  }

  async verifySignUpToken(verifySignUpTokenDto: VerifySignUpTokenDto) {
    const token = this.pendingVerifycations.get(verifySignUpTokenDto.email);

    if (!token) throw new NotFoundException('Không tìm thấy token');
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

  async sendOTPEmail(email: string, otp: number) {
    await this.mailerService.sendMail({
      to: email,
      subject: `Mã đăng nhập tài khoản Recruitment Web App: ${otp}`,
      text: `Your OTP code is ${otp}`,
      template: './sendOTP',
      context: { otp },
    });
  }

  async sendForgotPasswordURL(
    email: string,
    params: {
      fullName: string;
      token: string;
    },
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Đặt lại mật khẩu cho tài khoản Recruitment Web App',
      template: './forgotPassword',
      context: {
        fullName: params.fullName,
        action_url: `${this.configService.get<string>('CLIENT_URL')}/reset-password?token=${
          params.token
        }`,
        web_app_url: this.configService.get<string>('CLIENT_URL'),
      },
    });
  }

  async sendSignUpVerificationEmailURL(
    email: string,
    params: {
      token: string;
    },
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Xác thực tài khoản Recruitment Web App',
      template: './sendVerifyEmail',
      context: {
        verify_email_url: `${this.configService.get<string>('CLIENT_URL')}/verify-email?email=${email}&token=${
          params.token
        }`,
        web_app_url: this.configService.get<string>('CLIENT_URL'),
      },
    });
  }
}
