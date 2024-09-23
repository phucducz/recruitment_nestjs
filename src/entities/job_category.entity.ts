import { Column, Entity, OneToMany } from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { BaseEntity } from './base.entity';
import { Job } from './job.entity';
import { WorkExperience } from './work_experience.entity';

@Entity({ name: 'job_categories' })
export class JobCategory extends BaseEntity {
  @Field()
  @Column({ type: 'varchar', length: 45 })
  name: string;

  @Field()
  @Column({ type: 'varchar', length: 1000, nullable: true })
  description: string;

  @OneToMany(() => Job, (job) => job.jobCategory)
  jobs: Job[];

  @OneToMany(
    () => WorkExperience,
    (workExperience) => workExperience.jobCategory,
  )
  workExperience: WorkExperience[];
}
