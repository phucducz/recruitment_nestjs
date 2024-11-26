import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { BaseEntity } from './base.entity';
import { FunctionalGroup } from './functional_group.entity';

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
  )
  @JoinColumn({ name: 'functional_groups_id', foreignKeyConstraintName: 'id' })
  functionalGroup: FunctionalGroup;
}
