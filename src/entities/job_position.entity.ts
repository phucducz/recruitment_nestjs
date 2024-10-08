import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Job } from './job.entity';
import { User } from './user.entity';

@Entity({ name: 'job_positions' })
export class JobPosition extends BaseEntity {
  @Column({ type: 'varchar', length: 45 })
  title: string;

  @OneToMany(() => User, (user) => user.jobPosition)
  users: User[];

  @OneToMany(() => Job, (job) => job.jobPosition)
  jobs: Job[];
}
