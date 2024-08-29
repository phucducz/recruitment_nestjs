import { Module } from '@nestjs/common';
import { PlacementsService } from '../../services/placements.service';
import { PlacementsController } from './placements.controller';

@Module({
  controllers: [PlacementsController],
  providers: [PlacementsService],
})
export class PlacementsModule {}
