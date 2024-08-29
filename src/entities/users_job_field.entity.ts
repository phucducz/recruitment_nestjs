import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { JobField } from 'src/entities/job_field.entity';
import { User } from './user.entity';

@Entity({ name: 'users_job_fields' })
export class UsersJobField {
  @PrimaryColumn({ name: 'users_id', type: 'int' })
  users_id: number;

  @ManyToOne(() => User, (user) => user.usersJobFields)
  @JoinColumn([{ name: 'users_id', referencedColumnName: 'id' }])
  user: User;

  @PrimaryColumn({ name: 'job_fields_id', type: 'int' })
  job_fields_id: number;

  @ManyToOne(() => JobField, (jobField) => jobField.usersJobFields)
  @JoinColumn([{ name: 'job_fields_id', referencedColumnName: 'id' }])
  jobField: JobField;
}
