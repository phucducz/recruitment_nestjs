import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { AdminController } from './admin.controller';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';
import { AdminService } from 'src/services/admin.service';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    RolesModule,
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
    forwardRef(() => RefreshTokenModule),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
