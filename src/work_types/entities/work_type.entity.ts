import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from 'src/base/entities/base.entity';
import { Job } from 'src/jobs/entities/job.entity';
import { WorkExperience } from 'src/work_experiences/entities/work_experience.entity';

@Entity({ name: 'work_types' })
export class WorkType extends BaseEntity {
  @Column({ type: 'varchar', length: 45 })
  title: string;

  @OneToMany(() => WorkExperience, (workExperience) => workExperience.workType)
  workExperiences: WorkExperience[];

  @OneToMany(() => Job, (job) => job.workType)
  jobs: Job[];
}
