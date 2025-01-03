import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { BaseEntityNotId } from './base.entity';
import { Functional } from './functional.entity';
import { Role } from './role.entity';

@Entity({ name: 'roles_functionals' })
export class RolesFunctional extends BaseEntityNotId {
  @Field()
  @PrimaryColumn({ name: 'roles_id', type: 'int' })
  rolesId: number;

  @ManyToOne(() => Role, (role) => role.rolesFunctionals)
  @JoinColumn({ name: 'roles_id', referencedColumnName: 'id' })
  role: Role;

  @Field()
  @PrimaryColumn({ name: 'functionals_id', type: 'int' })
  functionalsId: number;

  @ManyToOne(() => Functional, (functional) => functional.rolesFunctionals)
  @JoinColumn({ name: 'functionals_id', referencedColumnName: 'id' })
  functional: Functional;
}
