import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { UsersJob } from './users_job.entity';

@Entity({ name: 'curriculum_vitaes' })
export class CurriculumVitae extends BaseEntity {
  @Field()
  @Column({ type: 'varchar', length: 100 })
  fileName: string;

  @Field()
  @Column({ type: 'varchar', length: 200 })
  url: string;

  @Field()
  @Column({ type: 'boolean', default: false, name: 'is_deleted' })
  isDeleted: boolean;

  @ManyToOne(() => User, (user) => user.curriculumVitae)
  @JoinColumn({ name: 'users_id', referencedColumnName: 'id' })
  user: User;

  @OneToMany(() => UsersJob, (usersJob) => usersJob.curriculumVitae)
  usersJobs: UsersJob[];
}
