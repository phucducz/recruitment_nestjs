import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Timestamp,
} from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { BaseEntity } from './base.entity';
import { DesiredJob } from './desired_job.entity';
import { DesiredJobsPlacement } from './desired_jobs_placement.entity';
import { DesiredJobsPosition } from './desired_jobs_position.entity';
import { Status } from './status.entity';
import { User } from './user.entity';

@Entity({ name: 'approvals' })
export class Approval extends BaseEntity {
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
  @Column({ type: 'varchar', name: 'reject_reason', nullable: true })
  rejectReason: string;

  @Field()
  @Column({ type: 'jsonb', nullable: true, name: 'desired_job_snapshot' })
  desiredJobSnapshot: Record<string, any>;

  @ManyToOne(() => DesiredJob, (desiredJob) => desiredJob.approvals)
  @JoinColumn({ name: 'desired_job_id', referencedColumnName: 'id' })
  desiredJob: DesiredJob;

  @ManyToOne(() => Status, (status) => status.desiredJobs)
  @JoinColumn({ name: 'status_id', referencedColumnName: 'id' })
  status: Status;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'approve_by' })
  approver: User;

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
}
