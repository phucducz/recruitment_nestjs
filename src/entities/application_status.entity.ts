import { Column, Entity, OneToMany } from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { BaseEntity } from './base.entity';
import { JobRecommendation } from './job_recomendation.entity';
import { UsersJob } from './users_job.entity';

@Entity({ name: 'application_status' })
export class ApplicationStatus extends BaseEntity {
  @Field()
  @Column({ type: 'varchar' })
  title: string;

  @OneToMany(() => UsersJob, (usersJob) => usersJob.applicationStatus)
  usesJobs: UsersJob[];

  @OneToMany(
    () => JobRecommendation,
    (jobRecommendation) => jobRecommendation.applicationStatus,
  )
  jobRecommendation: JobRecommendation[];
}
