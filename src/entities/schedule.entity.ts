import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { BaseEntity } from './base.entity';
import { Status } from './status.entity';
import { UsersJob } from './users_job.entity';

@Entity({ name: 'schedules' })
export class Schedule extends BaseEntity {
  @Field()
  @Column({ type: 'varchar', nullable: true })
  note: string;

  @Field()
  @Column({ type: 'timestamp without time zone', nullable: true })
  date: string;

  @ManyToOne(() => UsersJob, (usersJob) => usersJob.schedules)
  @JoinColumn([
    { name: 'users_id', referencedColumnName: 'usersId' },
    { name: 'jobs_id', referencedColumnName: 'jobsId' },
  ])
  usersJob: UsersJob;

  @ManyToOne(() => Status, (status) => status.schedules)
  @JoinColumn({ name: 'status_id', referencedColumnName: 'id' })
  status: Status;
}
