import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { BaseEntityNotId } from './base.entity';

import { Field } from 'src/common/decorators/field.decorator';
import { DesiredJob } from './desired_job.entity';
import { Placement } from './placement.entity';

@Entity({ name: 'desired_jobs_placements' })
export class DesiredJobsPlacement extends BaseEntityNotId {
  @Field()
  @PrimaryColumn({ name: 'desired_jobs_id', type: 'int' })
  desiredJobsId: number;

  @Field()
  @PrimaryColumn({ name: 'placements_id', type: 'int' })
  placementsId: number;

  @ManyToOne(() => DesiredJob, (desiredJob) => desiredJob.desiredJobsPlacement)
  @JoinColumn([{ name: 'desired_jobs_id', referencedColumnName: 'id' }])
  desiredJob: DesiredJob;

  @ManyToOne(() => Placement, (placement) => placement)
  @JoinColumn([{ name: 'placements_id', referencedColumnName: 'id' }])
  placement: Placement;
}
