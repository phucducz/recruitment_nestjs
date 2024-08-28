import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from 'src/base/entities/base.entity';
import { Job } from 'src/jobs/entities/job.entity';
import { UsersJobField } from 'src/users_job_fields/entities/users_job_field.entity';

@Entity({ name: 'job_fields' })
export class JobField extends BaseEntity {
  @Column({ type: 'varchar', length: 45 })
  title: string;

  @OneToMany(() => Job, (job) => job.jobField)
  jobs: Job[];

  @OneToMany(() => UsersJobField, (usersJobField) => usersJobField.jobField)
  usersJobFields: UsersJobField[];
}
