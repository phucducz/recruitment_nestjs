import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Timestamp,
} from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { JOB_STATUS } from 'src/common/utils/enums';
import { BaseEntity } from 'src/entities/base.entity';
import { JobCategory } from 'src/entities/job_category.entity';
import { JobField } from 'src/entities/job_field.entity';
import { JobPosition } from 'src/entities/job_position.entity';
import { JobRecomendation } from './job_recomendation.entity';
import { JobsPlacement } from './jobs_placement.entity';
import { User } from './user.entity';
import { UsersJob } from './users_job.entity';
import { WorkType } from './work_type.entity';

@Entity({ name: 'jobs' })
export class Job extends BaseEntity {
  @Field()
  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Field()
  @Column({ type: 'float', nullable: true, name: 'salary_min' })
  salaryMin: number;

  @Field()
  @Column({ type: 'float', nullable: true, name: 'salary_max' })
  salaryMax: number;

  @Field()
  @Column({ type: 'int', nullable: true, name: 'min_exp_year_required' })
  maxExpYearRequired: number;

  @Field()
  @Column({ type: 'int', nullable: true, name: 'max_exp_year_required' })
  minExpYearRequired: number;

  @Field()
  @Column({ type: 'timestamp without time zone', name: 'application_deadline' })
  applicationDeadline: Timestamp;

  @Field()
  @Column({ type: 'int', nullable: true, name: 'delete_by' })
  deleteBy: number;

  @Field()
  @Column({
    type: 'timestamp without time zone',
    nullable: true,
    name: 'delete_at',
  })
  deleteAt: Timestamp | string;

  @Column({
    type: 'varchar',
    length: 3,
    name: 'salary_currency',
    default: 'vnd',
    nullable: true,
  })
  salaryCurrency: TSalaryCurrency;

  @Field()
  @Column({ type: 'text', nullable: true })
  description: string;

  @Field()
  @Column({ type: 'text', nullable: true })
  requirements: string;

  @Field()
  @Column({ type: 'text', nullable: true })
  benefits: string;

  @Field()
  @Column({ type: 'int', default: 1, nullable: true })
  quantity: number;

  @Field()
  @Column({ type: 'varchar', enum: JOB_STATUS, default: JOB_STATUS.ACTIVE })
  status: string;

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

  @OneToMany(() => JobRecomendation, (jobRecomendation) => jobRecomendation.job)
  jobRecomendations: JobRecomendation[];
}
