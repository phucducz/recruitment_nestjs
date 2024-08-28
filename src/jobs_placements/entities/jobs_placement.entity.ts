import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Job } from 'src/jobs/entities/job.entity';
import { Placement } from 'src/placements/entities/placement.entity';

@Entity({ name: 'jobs_placements' })
export class JobsPlacement {
  @PrimaryColumn({ name: 'jobs_id', type: 'int' })
  jobs_id: number;

  @ManyToOne(() => Job, (job) => job.jobsPlacements)
  @JoinColumn([{ name: 'jobs_id', referencedColumnName: 'id' }])
  job: Job;

  @PrimaryColumn({ name: 'placements_id', type: 'int' })
  placements_id: number;

  @ManyToOne(() => Placement, (placement) => placement.jobsPlacements)
  @JoinColumn([{ name: 'placements_id', referencedColumnName: 'id' }])
  placement: Placement;
}
