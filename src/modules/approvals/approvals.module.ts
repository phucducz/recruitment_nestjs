import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Approval } from 'src/entities/approval.entity';
import { ApprovalsService } from 'src/services/approvals.service';
import { AuthModule } from '../auth/auth.module';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';
import { StatusModule } from '../status/status.module';
import { UsersModule } from '../users/users.module';
import { ApprovalsController } from './approvals.controller';
import { ApprovalsRepository } from './approvals.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Approval]),
    StatusModule,
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
    forwardRef(() => RefreshTokenModule),
  ],
  controllers: [ApprovalsController],
  providers: [ApprovalsService, ApprovalsRepository],
  exports: [ApprovalsService, ApprovalsRepository],
})
export class ApprovalsModule {}
