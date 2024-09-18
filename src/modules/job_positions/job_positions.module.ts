import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobPosition } from 'src/entities/job_position.entity';
import { JobPositionsService } from '../../services/job_positions.service';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';
import { JobPositionsController } from './job_positions.controller';
import { JobPositionsRepository } from './job_positions.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobPosition]),
    forwardRef(() => AuthModule),
    forwardRef(() => RefreshTokenModule),
  ],
  controllers: [JobPositionsController],
  providers: [JobPositionsService, JobPositionsRepository, JwtAuthGuard],
  exports: [JobPositionsService],
})
export class JobPositionsModule {}
