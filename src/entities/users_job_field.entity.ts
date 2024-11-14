import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { JobField } from 'src/entities/job_field.entity';
import { BaseEntityNotId } from './base.entity';
import { User } from './user.entity';

@Entity({ name: 'users_job_fields' })
export class UsersJobField extends BaseEntityNotId {
  @Field()
  @PrimaryColumn({ name: 'users_id', type: 'int' })
  usersId?: number;

  @ManyToOne(() => User, (user) => user.usersJobFields)
  @JoinColumn([{ name: 'users_id', referencedColumnName: 'id' }])
  user: User;

  @Field()
  @PrimaryColumn({ name: 'job_fields_id', type: 'int' })
  jobFieldsId?: number;

  @ManyToOne(() => JobField, (jobField) => jobField.usersJobFields)
  @JoinColumn([{ name: 'job_fields_id', referencedColumnName: 'id' }])
  jobField: JobField;
}
