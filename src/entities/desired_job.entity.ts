import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  Timestamp,
} from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { START_AFTER_OFFER_DESIRED_JOB } from 'src/common/utils/enums';
import { BaseEntity } from './base.entity';
import { DesiredJobsPlacement } from './desired_jobs_placement.entity';
import { DesiredJobsPosition } from './desired_jobs_position.entity';
import { JobField } from './job_field.entity';
import { User } from './user.entity';
import { Status } from './status.entity';

@Entity({ name: 'desired_jobs' })
export class DesiredJob extends BaseEntity {
  @Field()
  @Column({ type: 'int', nullable: true, name: 'approve_by' })
  approveBy: number;

  @Field()
  @Column({
    nullable: true,
    name: 'approve_at',
    type: 'timestamp without time zone',
  })
  approveAt: Timestamp | string;

  @Field()
  @Column({ type: 'int', name: 'salary_expectation' })
  salarayExpectation: number;

  @Field()
  @Column({
    type: 'varchar',
    name: 'start_after_offer',
    enum: START_AFTER_OFFER_DESIRED_JOB,
    default: START_AFTER_OFFER_DESIRED_JOB.NOW,
  })
  startAfterOffer: string;

  @Field()
  @Column({ type: 'int', name: 'total_year_experience' })
  totalYearExperience: number;

  @Field()
  @Column({ type: 'varchar', name: 'year_of_birth' })
  yearOfBirth: string;

  @Field()
  @Column({ type: 'varchar', name: 'reject_reason', nullable: true })
  rejectReason: string;

  @ManyToOne(() => JobField, (jobField) => jobField.desiredJobs)
  @JoinColumn({ name: 'job_fields_id', referencedColumnName: 'id' })
  jobField: JobField;

  @OneToOne(() => User, (user) => user.desiredJob)
  @JoinColumn({ name: 'users_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Status, (status) => status.desiredJobs)
  @JoinColumn({ name: 'status_id', referencedColumnName: 'id' })
  status: Status;

  @OneToMany(
    () => DesiredJobsPlacement,
    (desiredJobsPlacement) => desiredJobsPlacement.desiredJob,
  )
  desiredJobsPlacement: DesiredJobsPlacement[];

  @OneToMany(
    () => DesiredJobsPosition,
    (desiredJobsPosition) => desiredJobsPosition.desiredJob,
  )
  desiredJobsPosition: DesiredJobsPosition[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'approve_by' })
  approver: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'create_by' })
  creator: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'update_by' })
  updater: User;
}
