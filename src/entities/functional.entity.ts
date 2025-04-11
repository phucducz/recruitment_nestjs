import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { BaseEntity } from './base.entity';
import { FunctionalGroup } from './functional_group.entity';
import { RolesFunctional } from './roles_functional.entity';
import { User } from './user.entity';

@Entity({ name: 'functionals' })
export class Functional extends BaseEntity {
  @Field()
  @Column({ type: 'varchar', length: 50 })
  title: string;

  @Field()
  @Column({ type: 'varchar', length: 50, nullable: true })
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
    { onDelete: 'CASCADE', cascade: true },
  )
  rolesFunctionals: RolesFunctional[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'create_by' })
  creator: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'update_by' })
  updater: User;
}
