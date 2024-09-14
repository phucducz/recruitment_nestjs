import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Placement } from 'src/entities/placement.entity';
import { PlacementsService } from '../../services/placements.service';
import { PlacementsController } from './placements.controller';
import { PlacementsRepository } from './placements.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Placement])],
  controllers: [PlacementsController],
  providers: [PlacementsService, PlacementsRepository],
  exports: [PlacementsService],
})
export class PlacementsModule {}
