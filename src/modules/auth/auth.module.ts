import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'src/entities/auth.entity';
import { MailModule } from '../mail/mail.module';
import { OTPModule } from '../otp/otp.module';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';
import { ResetPasswordModule } from '../reset_password/reset_password.module';
import { RolesModule } from '../roles/roles.module';
import { UsersConverter } from '../users/users.converter';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth]),
    RolesModule,
    MailModule,
    OTPModule,
    ResetPasswordModule,
    forwardRef(() => UsersModule),
    forwardRef(() => RefreshTokenModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '30s' },
        // signOptions: { expiresIn: 3600 * 3 },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersConverter, JwtStrategy, JwtAuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
