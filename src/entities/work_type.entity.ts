import { Column, Entity, OneToMany } from 'typeorm';

import { Job } from 'src/entities/job.entity';
import { WorkExperience } from 'src/entities/work_experience.entity';
import { BaseEntity } from './base.entity';
import { Field } from 'src/common/decorators/field.decorator';

@Entity({ name: 'work_types' })
export class WorkType extends BaseEntity {
  @Field()
  @Column({ type: 'varchar', length: 45 })
  title: string;

  @OneToMany(() => Job, (job) => job.workType)
  jobs: Job[];
}
