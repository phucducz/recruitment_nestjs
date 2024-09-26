import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(
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
}
