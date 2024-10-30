import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { BaseEntityNotId } from './base.entity';
import { DesiredJob } from './desired_job.entity';
import { JobPosition } from './job_position.entity';

@Entity({ name: 'desired_jobs_positions' })
export class DesiredJobsPosition extends BaseEntityNotId {
  @Field()
  @PrimaryColumn({ name: 'desired_jobs_id', type: 'int' })
  desiredJobsId: number;

  @Field()
  @PrimaryColumn({ name: 'job_positions_id', type: 'int' })
  jobPositionsId: number;

  @ManyToOne(() => DesiredJob, (desiredJob) => desiredJob.desiredJobsPosition)
  @JoinColumn([{ name: 'desired_jobs_id', referencedColumnName: 'id' }])
  desiredJob: DesiredJob;

  @ManyToOne(
    () => JobPosition,
    (jobPosition) => jobPosition.desiredJobsPositions,
  )
  @JoinColumn([{ name: 'job_positions_id', referencedColumnName: 'id' }])
  jobPosition: JobPosition;
}
