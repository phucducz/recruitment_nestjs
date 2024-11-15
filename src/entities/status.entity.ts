import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { BaseEntity } from './base.entity';
import { StatusType } from './status_type.entity';
import { UsersJob } from './users_job.entity';

@Entity({ name: 'status' })
export class Status extends BaseEntity {
  @Field()
  @Column({ type: 'varchar' })
  title: string;

  @ManyToOne(() => StatusType, (statusType) => statusType)
  @JoinColumn({ name: 'status_types_id', referencedColumnName: 'id' })
  statusType: StatusType;

  @OneToMany(() => UsersJob, (usersJob) => usersJob.status)
  usesJobs: UsersJob[];
}
