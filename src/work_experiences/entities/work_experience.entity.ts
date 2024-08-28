import { Column, Entity, ManyToOne, Timestamp } from 'typeorm';

import { BaseEntity } from 'src/base/entities/base.entity';
import { User } from 'src/users/entities/user.entity';
import { WorkType } from 'src/work_types/entities/work_type.entity';
import { Placement } from 'src/placements/entities/placement.entity';

@Entity({ name: 'work_experiences' })
export class WorkExperience extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  company_name: string;

  @Column({ type: 'varchar', length: 45 })
  position: string;

  @Column({ type: 'boolean' })
  is_working: boolean;

  @Column({ type: 'timestamp without time zone' })
  start_date: Timestamp;

  @Column({ type: 'timestamp without time zone' })
  end_date: Timestamp;

  @Column({ type: 'varchar', length: 1000 })
  description: string;

  @ManyToOne(() => User, (user) => user.workExperiences)
  user: User;

  @ManyToOne(() => WorkType, (workType) => workType.workExperiences)
  workType: WorkType;

  @ManyToOne(() => Placement, (placement) => placement.workExperiences)
  placement: Placement;
}
