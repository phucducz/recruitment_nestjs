import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Job } from './job.entity';

@Entity({ name: 'job_categories' })
export class JobCategory extends BaseEntity {
  @Column({ type: 'varchar', length: 45 })
  name: string;

  @Column({ type: 'varchar', length: 1000 })
  description: string;

  @OneToMany(() => Job, (job) => job.jobCategory)
  jobs: Job[];
}
