import { Module } from '@nestjs/common';
import { AchivementsService } from '../../services/achivements.service';
import { AchivementsController } from './achivements.controller';

@Module({
  controllers: [AchivementsController],
  providers: [AchivementsService],
})
export class AchivementsModule {}
