import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Timestamp,
} from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { BaseEntityNotId } from './base.entity';
import { CurriculumVitae } from './curriculum_vitae';
import { Job } from './job.entity';
import { Schedule } from './schedule.entity';
import { Status } from './status.entity';
import { User } from './user.entity';

@Entity({ name: 'users_jobs' })
export class UsersJob extends BaseEntityNotId {
  @Field()
  @Column({
    type: 'timestamp without time zone',
    name: 'cv_viewed_at',
    nullable: true,
  })
  cvViewedAt: string;

  @Field()
  @Column({ type: 'int', name: 'referrer_id', nullable: true })
  referrerId: number;

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
  employerUpdateAt: Timestamp | string;

  @Field()
  @PrimaryColumn({ name: 'users_id', type: 'int' })
  usersId: number;

  @ManyToOne(() => User, (user) => user.usersJobs)
  @JoinColumn({ name: 'users_id', referencedColumnName: 'id' })
  user: User;

  @Field()
  @PrimaryColumn({ name: 'jobs_id', type: 'int' })
  jobsId: number;

  @ManyToOne(() => Job, (job) => job.usersJobs)
  @JoinColumn({ name: 'jobs_id', referencedColumnName: 'id' })
  job: Job;

  @ManyToOne(
    () => CurriculumVitae,
    (curriculumVitae) => curriculumVitae.usersJobs,
    { nullable: true, onDelete: 'SET NULL' },
  )
  @JoinColumn({ name: 'curriculum_vitaes_id', referencedColumnName: 'id' })
  curriculumVitae: CurriculumVitae;

  @ManyToOne(() => Status, (status) => status.usesJobs)
  @JoinColumn({ name: 'status_id', referencedColumnName: 'id' })
  status: Status;

  @OneToMany(() => Schedule, (schedule) => schedule.usersJob)
  schedules: Schedule[];
}
