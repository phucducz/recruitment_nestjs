import { Column, Entity, JoinColumn, ManyToOne, Timestamp } from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { ApplicationStatus } from './application_status.entity';
import { BaseEntity } from './base.entity';
import { Job } from './job.entity';
import { JobPosition } from './job_position.entity';

@Entity({ name: 'job_recommendations' })
export class JobRecommendation extends BaseEntity {
  @Field()
  @Column({ type: 'varchar', name: 'full_name' })
  fullName: string;

  @Field()
  @Column({ type: 'varchar' })
  email: string;

  @Field()
  @Column({ type: 'varchar', name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Field()
  @Column({ type: 'varchar', name: 'file_name' })
  fileName: string;

  @Field()
  @Column({ type: 'varchar', name: 'cv_url' })
  cvUrl: string;

  @Field()
  @Column({ type: 'int', name: 'referrer_id', nullable: true })
  referrerId: number;

  @Field()
  @Column({
    type: 'timestamp without time zone',
    nullable: true,
    name: 'cv_viewed_at',
  })
  cvViewedAt: Timestamp | string;

  @Field()
  @Column({
    type: 'int',
    nullable: true,
    name: 'employer_update_by',
  })
  employerUpdateBy: number;

  @Field()
  @Column({
    type: 'timestamp without time zone',
    nullable: true,
    name: 'employer_update_at',
  })
  employerUpdateAt: string;

  @ManyToOne(() => Job, (job) => job.jobRecomendations)
  @JoinColumn({ name: 'jobs_id', referencedColumnName: 'id' })
  job: Job;

  @ManyToOne(
    () => ApplicationStatus,
    (applicationStatus) => applicationStatus.jobRecommendation,
  )
  @JoinColumn({ name: 'applications_id', referencedColumnName: 'id' })
  applicationStatus: ApplicationStatus;

  @ManyToOne(() => JobPosition, (jobPosition) => jobPosition.jobRecomendations)
  @JoinColumn({ name: 'job_positions_id', referencedColumnName: 'id' })
  jobPosition: JobPosition;
}
