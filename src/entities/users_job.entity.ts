import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { BaseEntityNotId } from './base.entity';
import { Job } from './job.entity';
import { User } from './user.entity';

@Entity({ name: 'users_jobs' })
export class UsersJob extends BaseEntityNotId {
  @Column({ type: 'varchar', nullable: true })
  curriculumVitaeLink: string;

  @PrimaryColumn({ name: 'users_id', type: 'int' })
  usersId: number;

  @ManyToOne(() => User, (user) => user.usersJobs)
  @JoinColumn({ name: 'users_id', referencedColumnName: 'id' })
  user: User;

  @PrimaryColumn({ name: 'jobs_id', type: 'int' })
  jobsId: number;

  @ManyToOne(() => Job, (job) => job.usersJobs)
  @JoinColumn({ name: 'jobs_id', referencedColumnName: 'id' })
  job: Job;
}
