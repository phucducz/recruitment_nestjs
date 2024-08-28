import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/base/entities/base.entity';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'achivements' })
export class Achivement extends BaseEntity {
  @Column({ type: 'varchar', length: 1000 })
  description: string;

  @ManyToOne(() => User, (user) => user.achivements)
  user: User;
}
