import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RefreshToken } from 'src/entities/refresh_token.entity';
import { RolesFunctional } from 'src/entities/roles_functional.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { RefreshTokenController } from './refresh_token.controller';
import { RefreshTokensRepository } from './refresh_token.repository';
import { RefreshTokenService } from './refresh_token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken, RolesFunctional]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [RefreshTokenController],
  providers: [RefreshTokenService, RefreshTokensRepository],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
