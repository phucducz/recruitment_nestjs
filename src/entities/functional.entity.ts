import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { BaseEntity } from './base.entity';
import { FunctionalGroup } from './functional_group.entity';
import { RolesFunctional } from './roles_functional.entity';

@Entity({ name: 'functionals' })
export class Functional extends BaseEntity {
  @Field()
  @Column({ type: 'varchar', length: 50 })
  title: string;

  @Field()
  @Column({ type: 'varchar', length: 20 })
  code: string;

  @ManyToOne(
    () => FunctionalGroup,
    (functionalGroup) => functionalGroup.functionals,
    { nullable: true, onDelete: 'SET NULL' },
  )
  @JoinColumn({ name: 'functional_groups_id', referencedColumnName: 'id' })
  functionalGroup: FunctionalGroup;

  @OneToMany(
    () => RolesFunctional,
    (rolesFunctional) => rolesFunctional.functional,
    { onDelete: 'CASCADE' },
  )
  rolesFunctionals: RolesFunctional[];
}
