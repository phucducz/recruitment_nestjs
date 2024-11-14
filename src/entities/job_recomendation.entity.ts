import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { ApplicationStatus } from './application_status.entity';
import { BaseEntity } from './base.entity';
import { Job } from './job.entity';

@Entity({ name: 'job_recomendations' })
export class JobRecomendation extends BaseEntity {
  @Field()
  @Column({ type: 'varchar' })
  fullName: string;

  @Field()
  @Column({ type: 'varchar' })
  email: string;

  @Field()
  @Column({ type: 'varchar', name: 'phone_number' })
  phoneNumber: string;

  @Field()
  @Column({ type: 'varchar', name: 'file_name' })
  fileName: string;

  @Field()
  @Column({ type: 'varchar', name: 'cv_url' })
  cvUrl: string;

  @ManyToOne(() => Job, (job) => job.jobRecomendations)
  @JoinColumn({ name: 'jobs_id', referencedColumnName: 'id' })
  job: Job;

  @ManyToOne(
    () => ApplicationStatus,
    (applicationStatus) => applicationStatus.jobRecomendation,
  )
  @JoinColumn({ name: 'applications_id', referencedColumnName: 'id' })
  applicationStatus: ApplicationStatus;
}
