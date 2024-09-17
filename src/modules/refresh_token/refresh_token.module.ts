import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RefreshToken } from 'src/entities/refresh_token.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { RefreshTokenController } from './refresh_token.controller';
import { RefreshTokensRepository } from './refresh_token.repository';
import { RefreshTokenService } from './refresh_token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
    UsersModule,
    JwtModule,
    forwardRef(() => AuthModule),
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
  controllers: [RefreshTokenController],
  providers: [RefreshTokenService, RefreshTokensRepository],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
