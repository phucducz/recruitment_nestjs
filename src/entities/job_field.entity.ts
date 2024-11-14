import { Column, Entity, OneToMany } from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { BaseEntity } from './base.entity';
import { DesiredJob } from './desired_job.entity';
import { Job } from './job.entity';
import { UsersJobField } from './users_job_field.entity';

@Entity({ name: 'job_fields' })
export class JobField extends BaseEntity {
  @Field()
  @Column({ type: 'varchar', length: 45 })
  title: string;

  @OneToMany(() => Job, (job) => job.jobField)
  jobs: Job[];

  @OneToMany(() => UsersJobField, (usersJobField) => usersJobField.jobField)
  usersJobFields: UsersJobField[];

  @OneToMany(() => DesiredJob, (desiredJob) => desiredJob.jobField)
  desiredJobs: DesiredJob[];
}
