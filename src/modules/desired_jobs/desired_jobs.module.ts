import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Achivement } from 'src/entities/achivement.entity';
import { DesiredJob } from 'src/entities/desired_job.entity';
import { DesiredJobsPlacement } from 'src/entities/desired_jobs_placement.entity';
import { DesiredJobsPosition } from 'src/entities/desired_jobs_position.entity';
import { JobField } from 'src/entities/job_field.entity';
import { JobPosition } from 'src/entities/job_position.entity';
import { Placement } from 'src/entities/placement.entity';
import { User } from 'src/entities/user.entity';
import { UsersJobField } from 'src/entities/users_job_field.entity';
import { UsersSkill } from 'src/entities/users_skill.entity';
import { DesiredJobsService } from '../../services/desired_jobs.service';
import { AchivementsRepository } from '../achivements/achivements.repository';
import { AuthModule } from '../auth/auth.module';
import { DesiredJobsPlacementRepository } from '../desired_jobs_placements/desired_jobs_placement.repository';
import { DesiredJobsPositionRepository } from '../desired_jobs_positions/desired_jobs_position.repository';
import { JobFieldsModule } from '../job_fields/job_fields.module';
import { JobFieldsRepository } from '../job_fields/job_fields.repository';
import { JobPositionsRepository } from '../job_positions/job_positions.repository';
import { PlacementsRepository } from '../placements/placements.repository';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';
import { SkillsModule } from '../skills/skills.module';
import { UsersModule } from '../users/users.module';
import { UsersRepository } from '../users/users.repository';
import { UsersSkillsModule } from '../users_skills/users_skills.module';
import { UsersSkillsRepository } from '../users_skills/users_skills.repository';
import { DesiredJobsController } from './desired_jobs.controller';
import { DesiredJobsRepository } from './desired_jobs.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DesiredJob,
      DesiredJobsPlacement,
      DesiredJobsPosition,
      Placement,
      JobPosition,
      JobField,
      User,
      UsersJobField,
      Achivement,
      UsersSkill,
    ]),
    JobFieldsModule,
    forwardRef(() => AuthModule),
    forwardRef(() => RefreshTokenModule),
    UsersModule,
    UsersSkillsModule,
    SkillsModule,
  ],
  controllers: [DesiredJobsController],
  providers: [
    DesiredJobsService,
    DesiredJobsRepository,
    DesiredJobsPlacementRepository,
    DesiredJobsPositionRepository,
    PlacementsRepository,
    JobPositionsRepository,
    JobFieldsRepository,
    UsersRepository,
    AchivementsRepository,
    UsersSkillsRepository,
  ],
  exports: [DesiredJobsService],
})
export class DesiredJobsModule {}
