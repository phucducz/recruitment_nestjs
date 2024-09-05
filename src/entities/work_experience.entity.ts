import { Column, Entity, ManyToOne, Timestamp } from 'typeorm';

import { Placement } from 'src/entities/placement.entity';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { WorkType } from './work_type.entity';

@Entity({ name: 'work_experiences' })
export class WorkExperience extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  company_name: string;

  @Column({ type: 'varchar', length: 45 })
  position: string;

  @Column({ type: 'boolean', default: false })
  is_working: boolean;

  @Column({ type: 'timestamp without time zone' })
  start_date: Timestamp;

  @Column({ type: 'timestamp without time zone', nullable: true })
  end_date: Timestamp;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.workExperiences)
  user: User;

  @ManyToOne(() => WorkType, (workType) => workType.workExperiences)
  workType: WorkType;

  @ManyToOne(() => Placement, (placement) => placement.workExperiences)
  placement: Placement;
}
