import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Job } from 'src/jobs/entities/job.entity';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'users_jobs' })
export class UsersJob {
  @PrimaryColumn({ name: 'users_id', type: 'int' })
  users_id: number;

  @ManyToOne(() => User, (user) => user.usersJobs)
  @JoinColumn({ name: 'users_id', referencedColumnName: 'id' })
  user: User;

  @PrimaryColumn({ name: 'jobs_id', type: 'int' })
  jobs_id: number;

  @ManyToOne(() => Job, (job) => job.usersJobs)
  @JoinColumn({ name: 'jobs_id', referencedColumnName: 'id' })
  job: Job;
}
