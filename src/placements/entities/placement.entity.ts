import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from 'src/base/entities/base.entity';
import { JobsPlacement } from 'src/jobs_placements/entities/jobs_placement.entity';
import { WorkExperience } from 'src/work_experiences/entities/work_experience.entity';

@Entity({ name: 'placements' })
export class Placement extends BaseEntity {
  @Column({ type: 'varchar', length: 45 })
  title: string;

  @OneToMany(() => WorkExperience, (workExperience) => workExperience.placement)
  workExperiences: WorkExperience[];

  @OneToMany(() => JobsPlacement, (jobsPlacement) => jobsPlacement.placement)
  jobsPlacements: JobsPlacement[];
}
