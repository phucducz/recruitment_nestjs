import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  FORGOT_PASSWORD_TOKEN_STATUS,
  UNAUTHORIZED_EXCEPTION_MESSAGE,
} from 'src/common/utils/enums';

@Injectable()
export class MailService {
  constructor(
    @Inject(ConfigService) private configService: ConfigService,
    @Inject(MailerService) private readonly mailerService: MailerService,
  ) {}

  async sendOTPEmail(email: string, otp: number) {
    await this.mailerService.sendMail({
      to: email,
      subject: `Mã đăng nhập tài khoản: ${otp}`,
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
      subject: 'Đặt lại mật khẩu cho Recruitment Web App account',
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
}
