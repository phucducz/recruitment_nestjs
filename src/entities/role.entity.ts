import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { RolesFunctional } from './roles_functional.entity';

@Entity({ name: 'roles' })
export class Role extends BaseEntity {
  @Field()
  @Column({ type: 'varchar', length: 10 })
  title: string;

  @Field()
  @Column({ type: 'varchar', length: 100, nullable: true })
  description: string;

  @OneToMany(() => User, (user) => user.role, {
    onDelete: 'SET NULL',
  })
  users: User[];

  @OneToMany(() => RolesFunctional, (rolesFunctional) => rolesFunctional.role, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  rolesFunctionals: RolesFunctional[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'create_by' })
  creator: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'update_by' })
  updater: User;
}
