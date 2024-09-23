import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkExperience } from 'src/entities/work_experience.entity';
import { WorkExperiencesService } from '../../services/work_experiences.service';
import { JobCategoriesModule } from '../job_categories/job_categories.module';
import { JobPositionsModule } from '../job_positions/job_positions.module';
import { PlacementsModule } from '../placements/placements.module';
import { WorkExperiencesController } from './work_experiences.controller';
import { WorkExperiencesRepository } from './work_experiences.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkExperience]),
    JobCategoriesModule,
    JobPositionsModule,
    PlacementsModule,
  ],
  controllers: [WorkExperiencesController],
  providers: [WorkExperiencesService, WorkExperiencesRepository],
  exports: [WorkExperiencesService],
})
export class WorkExperiencesModule {}
