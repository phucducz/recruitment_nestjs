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

  @Column({ type: 'float', nullable: true, name: 'start_price' })
  startPrice: number;

  @Column({ type: 'float', nullable: true, name: 'end_price' })
  endPrice: number;

  @Column({ type: 'int', nullable: true, name: 'start_exp_year_required' })
  startExpYearRequired: number;

  @Column({ type: 'int', nullable: true, name: 'end_exp_year_required' })
  endExpYearRequired: number;

  @Column({ type: 'timestamp without time zone', name: 'application_deadline' })
  applicationDeadline: Timestamp;

  @Column({ type: 'varchar', length: 1000, name: 'work_time' })
  workTime: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  requirement: string;

  @Column({ type: 'text', name: 'why_love_working_here', nullable: true })
  whyLove: string;

  @ManyToOne(() => JobCategory, (jobCategory) => jobCategory.jobs)
  @JoinColumn({ name: 'job_categories_id', referencedColumnName: 'id' })
  jobCategory: JobCategory;

  @ManyToOne(() => JobPosition, (jobPosition) => jobPosition.jobs)
  @JoinColumn({ name: 'job_positions_id', referencedColumnName: 'id' })
  jobPosition: JobPosition;

  @ManyToOne(() => JobField, (jobField) => jobField.jobs)
  @JoinColumn({ name: 'job_fields_id', referencedColumnName: 'id' })
  jobField: JobField;

  @OneToMany(() => JobsPlacement, (jobsPlacement) => jobsPlacement.job)
  jobsPlacements: JobsPlacement[];

  @ManyToOne(() => User, (user) => user.jobs)
  @JoinColumn({ name: 'users_id', referencedColumnName: 'id' })
  user: User;

  @OneToMany(() => UsersJob, (usersJob) => usersJob.job)
  usersJobs: UsersJob[];

  @ManyToOne(() => WorkType, (workType) => workType.jobs)
  @JoinColumn({ name: 'work_types_id', referencedColumnName: 'id' })
  workType: WorkType;
}
