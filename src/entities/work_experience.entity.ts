import { Column, Entity, JoinColumn, ManyToOne, Timestamp } from 'typeorm';

import { Placement } from 'src/entities/placement.entity';
import { BaseEntity } from './base.entity';
import { JobCategory } from './job_category.entity';
import { JobPosition } from './job_position.entity';
import { User } from './user.entity';

@Entity({ name: 'work_experiences' })
export class WorkExperience extends BaseEntity {
  @Column({ type: 'varchar', length: 100, name: 'company_name' })
  companyName: string;

  @Column({ type: 'boolean', default: false, name: 'is_working' })
  isWorking: boolean;

  @Column({ type: 'timestamp without time zone', name: 'start_date' })
  startDate: Timestamp;

  @Column({
    type: 'timestamp without time zone',
    nullable: true,
    name: 'end_date',
  })
  endDate: Timestamp;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.workExperiences)
  @JoinColumn({ name: 'users_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Placement, (placement) => placement.workExperiences, {
    nullable: true,
  })
  @JoinColumn({ name: 'placements_id', referencedColumnName: 'id' })
  placement: Placement;

  @ManyToOne(() => JobPosition, (jobPosition) => jobPosition.workExperiences)
  @JoinColumn({ name: 'job_positions_id', referencedColumnName: 'id' })
  jobPosition: JobPosition;

  @ManyToOne(() => JobCategory, (jobCategory) => jobCategory.workExperience)
  @JoinColumn({ name: 'job_categories_id', referencedColumnName: 'id' })
  jobCategory: JobCategory;
}
