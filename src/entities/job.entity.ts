import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Timestamp,
} from 'typeorm';

import { BaseEntity } from 'src/entities/base.entity';
import { JobCategory } from 'src/entities/job_category.entity';
import { JobField } from 'src/entities/job_field.entity';
import { JobPosition } from 'src/entities/job_position.entity';
import { JobsPlacement } from './jobs_placement.entity';
import { User } from './user.entity';
import { UsersJob } from './users_job.entity';
import { WorkType } from './work_type.entity';

@Entity({ name: 'jobs' })
export class Job extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'float' })
  start_price: number;

  @Column({ type: 'float' })
  end_price: number;

  @Column({ type: 'int' })
  start_exp_year_required: number;

  @Column({ type: 'int' })
  end_exp_year_required: number;

  @Column({ type: 'timestamp without time zone' })
  application_deadline: Timestamp;

  @Column({ type: 'varchar', length: 45 })
  work_time: string;

  @ManyToOne(() => JobCategory, (jobCategory) => jobCategory.jobs)
  jobCategory: JobCategory;

  @ManyToOne(() => JobPosition, (jobPosition) => jobPosition.jobs)
  jobPosition: JobPosition;

  @ManyToOne(() => JobField, (jobField) => jobField.jobs)
  jobField: JobField;

  @OneToMany(() => JobsPlacement, (jobsPlacement) => jobsPlacement.job)
  jobsPlacements: JobsPlacement[];

  @ManyToOne(() => User, (user) => user.jobs)
  @JoinColumn({ name: 'users_id' })
  user: User;

  @OneToMany(() => UsersJob, (usersJob) => usersJob.job)
  usersJobs: UsersJob[];

  @ManyToOne(() => WorkType, (workType) => workType.jobs)
  workType: WorkType;
}
