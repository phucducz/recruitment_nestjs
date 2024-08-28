import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from 'src/base/entities/base.entity';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'roles' })
export class Role extends BaseEntity {
  @Column({ type: 'varchar', length: 10 })
  title: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
