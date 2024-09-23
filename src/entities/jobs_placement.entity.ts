import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { BaseEntity } from './base.entity';
import { Job } from './job.entity';
import { Placement } from './placement.entity';

@Entity({ name: 'jobs_placements' })
export class JobsPlacement extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'jobs_id', type: 'int' })
  jobsId: number;

  @ManyToOne(() => Job, (job) => job.jobsPlacements)
  @JoinColumn([{ name: 'jobs_id', referencedColumnName: 'id' }])
  job: Job;

  @Field()
  @PrimaryColumn({ name: 'placements_id', type: 'int' })
  placementsId: number;

  @ManyToOne(() => Placement, (placement) => placement.jobsPlacements)
  @JoinColumn([{ name: 'placements_id', referencedColumnName: 'id' }])
  placement: Placement;

  @Field()
  @Column({ type: 'varchar', length: 500, name: 'detail_address' })
  detailAddress: string;

  @Field()
  @Column({ type: 'int' })
  amount: number;
}
