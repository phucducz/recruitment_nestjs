import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity({ name: 'achivements' })
export class Achivement extends BaseEntity {
  @Field()
  @Column({ type: 'varchar', length: 1000 })
  description: string;

  // @ManyToOne(() => User, (user) => user.achivements)
  // user: User;

  @OneToOne(() => User, user => user.achivement)
  user: User;
}
