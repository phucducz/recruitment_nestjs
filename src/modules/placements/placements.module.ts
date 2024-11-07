import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Placement } from 'src/entities/placement.entity';
import { PlacementsService } from '../../services/placements.service';
import { AuthModule } from '../auth/auth.module';
import { DesiredJobsModule } from '../desired_jobs/desired_jobs.module';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';
import { PlacementsController } from './placements.controller';
import { PlacementsRepository } from './placements.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Placement]),
    forwardRef(() => AuthModule),
    forwardRef(() => RefreshTokenModule),
  ],
  controllers: [PlacementsController],
  providers: [PlacementsService, PlacementsRepository],
  exports: [PlacementsService, PlacementsRepository],
})
export class PlacementsModule {}
