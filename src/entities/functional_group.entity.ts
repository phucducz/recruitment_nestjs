import { Column, Entity, OneToMany } from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { BaseEntity } from './base.entity';
import { Functional } from './functional.entity';

@Entity({ name: 'functional_groups' })
export class FunctionalGroup extends BaseEntity {
  @Field()
  @Column({ type: 'varchar', length: 50 })
  title: string;

  @Field()
  @Column({ type: 'varchar', length: 200, nullable: true })
  description: string;

  @OneToMany(() => Functional, (functional) => functional.functionalGroup)
  functionals: Functional[];
}
