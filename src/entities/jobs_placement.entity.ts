import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Job } from './job.entity';
import { Placement } from './placement.entity';

@Entity({ name: 'jobs_placements' })
export class JobsPlacement {
  @PrimaryColumn({ name: 'jobs_id', type: 'int' })
  jobsId: number;

  @ManyToOne(() => Job, (job) => job.jobsPlacements)
  @JoinColumn([{ name: 'jobs_id', referencedColumnName: 'id' }])
  job: Job;

  @PrimaryColumn({ name: 'placements_id', type: 'int' })
  placementsId: number;

  @ManyToOne(() => Placement, (placement) => placement.jobsPlacements)
  @JoinColumn([{ name: 'placements_id', referencedColumnName: 'id' }])
  placement: Placement;

  @Column({ type: 'varchar', length: 500, name: 'detail_address' })
  detailAddress: string;

  @Column({ type: 'int' })
  amount: number;
}
