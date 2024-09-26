import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

import { MailService } from 'src/services/mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          transport: {
            host: configService.get<string>('NODEMAILER_HOST'),
            port: configService.get<number>('NODEMAILER_PORT'),
            secure: false,
            service: 'gmail',
            auth: {
              user: configService.get<string>('EMAIL'),
              pass: configService.get<string>('APP_PASSWORD'),
            },
          },
          defaults: {
            from: `"Recuitment Web App" <${configService.get<string>('EMAIL')}@gmail.com>`,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
