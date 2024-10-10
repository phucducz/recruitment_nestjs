import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { User } from './user.entity';
import { BaseEntity } from './base.entity';

@Entity({ name: 'curriculum_vitaes' })
export class CurriculumVitae extends BaseEntity {
  @Field()
  @Column({ type: 'varchar', length: 200 })
  url: string;

  @ManyToOne(() => User, (user) => user.curriculumVitae)
  @JoinColumn({ name: 'users_id', referencedColumnName: 'id' })
  user: User;
}
