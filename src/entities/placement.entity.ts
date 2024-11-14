import { Column, Entity, OneToMany } from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { JobsPlacement } from 'src/entities/jobs_placement.entity';
import { BaseEntity } from './base.entity';
import { DesiredJobsPlacement } from './desired_jobs_placement.entity';
import { WorkExperience } from './work_experience.entity';
import { User } from './user.entity';

@Entity({ name: 'placements' })
export class Placement extends BaseEntity {
  @Field()
  @Column({ type: 'varchar', length: 45 })
  title: string;

  @OneToMany(() => WorkExperience, (workExperience) => workExperience.placement)
  workExperiences: WorkExperience[];

  @OneToMany(() => JobsPlacement, (jobsPlacement) => jobsPlacement.placement)
  jobsPlacements: JobsPlacement[];

  @OneToMany(
    () => DesiredJobsPlacement,
    (desiredJobsPlacement) => desiredJobsPlacement.placement,
  )
  desiredJobsPlacement: DesiredJobsPlacement[];

  @OneToMany(() => User, (user) => user.placement)
  users: User[];
}
