import { Column, Entity, OneToMany } from 'typeorm';

import { JobsPlacement } from 'src/entities/jobs_placement.entity';
import { BaseEntity } from './base.entity';
import { WorkExperience } from './work_experience.entity';

@Entity({ name: 'placements' })
export class Placement extends BaseEntity {
  @Column({ type: 'varchar', length: 45 })
  title: string;

  @OneToMany(() => WorkExperience, (workExperience) => workExperience.placement)
  workExperiences: WorkExperience[];

  @OneToMany(() => JobsPlacement, (jobsPlacement) => jobsPlacement.placement)
  jobsPlacements: JobsPlacement[];
}
