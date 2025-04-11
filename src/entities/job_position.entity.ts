import { Column, Entity, OneToMany } from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { BaseEntity } from './base.entity';
import { DesiredJobsPosition } from './desired_jobs_position.entity';
import { Job } from './job.entity';
import { User } from './user.entity';
import { WorkExperience } from './work_experience.entity';

@Entity({ name: 'job_positions' })
export class JobPosition extends BaseEntity {
  @Field()
  @Column({ type: 'varchar', length: 45 })
  title: string;

  @OneToMany(() => User, (user) => user.jobPosition)
  users: User[];

  @OneToMany(() => Job, (job) => job.jobPosition)
  jobs: Job[];

  @OneToMany(
    () => WorkExperience,
    (workExperience) => workExperience.jobPosition,
  )
  workExperiences: WorkExperience[];

  @OneToMany(
    () => DesiredJobsPosition,
    (desiredJobsPosition) => desiredJobsPosition.jobPosition,
  )
  desiredJobsPositions: DesiredJobsPosition[];
}