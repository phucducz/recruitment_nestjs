import { Column, Entity, OneToMany } from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { BaseEntity } from './base.entity';
import { RolesFunctional } from './roles_functional.entity';
import { User } from './user.entity';

@Entity({ name: 'roles' })
export class Role extends BaseEntity {
  @Field()
  @Column({ type: 'varchar', length: 10 })
  title: string;

  @Field()
  @Column({ type: 'varchar', length: 100, nullable: true })
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @OneToMany(() => RolesFunctional, (rolesFunctional) => rolesFunctional.role)
  rolesFunctionals: RolesFunctional[];
}
