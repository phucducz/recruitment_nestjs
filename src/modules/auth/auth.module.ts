import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { RefreshTokenModule } from '../refresh_token/refresh_token.module';
import { RolesModule } from '../roles/roles.module';
import { UsersConverter } from '../users/users.converter';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    RolesModule,
    forwardRef(() => RefreshTokenModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {},
        // signOptions: { expiresIn: 3600 * 3 },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersConverter, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
