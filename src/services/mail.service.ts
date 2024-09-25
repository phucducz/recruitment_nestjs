import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: any;

  constructor(private configService: ConfigService) {
    console.log(
      this.configService.get<string>('EMAIL'),
      this.configService.get<string>('APP_PASSWORD'),
    );

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL'),
        pass: this.configService.get<string>('APP_PASSWORD'),
      },
    });

    this.transporter.verify(function (error, success) {
      if (error) {
        console.log('error', error);
      } else {
        console.log('Server is ready to take our messages');
      }
    });
  }

  async sendOTPEmail(email: string, otp: number) {
    const mailOptions = {
      from: `"Recuitment Web App" <${this.configService.get<string>('EMAIL')}@gmail.com>`,
      to: email,
      subject: `Mã đăng nhập tài khoản: ${otp}`,
      text: `Your OTP code is ${otp}`,
    };

    const info = await this.transporter.sendMail(mailOptions);
    console.log('info', info);
  }
}
