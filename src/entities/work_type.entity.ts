import { Column, Entity, OneToMany } from 'typeorm';

import { Job } from 'src/entities/job.entity';
import { WorkExperience } from 'src/entities/work_experience.entity';
import { BaseEntity } from './base.entity';

@Entity({ name: 'work_types' })
export class WorkType extends BaseEntity {
  @Column({ type: 'varchar', length: 45 })
  title: string;

  @OneToMany(() => WorkExperience, (workExperience) => workExperience.workType)
  workExperiences: WorkExperience[];

  @OneToMany(() => Job, (job) => job.workType)
  jobs: Job[];
}
