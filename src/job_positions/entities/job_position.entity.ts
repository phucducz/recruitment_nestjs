import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from 'src/base/entities/base.entity';
import { Job } from 'src/jobs/entities/job.entity';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'job_positions' })
export class JobPosition extends BaseEntity {
  @Column({ type: 'varchar', length: 45 })
  title: string;

  @OneToMany(() => User, (user) => user.jobPosition)
  users: User[];

  @OneToMany(() => Job, (job) => job.jobPosition)
  jobs: Job[];
}
