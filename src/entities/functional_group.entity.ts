import { Column, Entity } from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { BaseEntity } from './base.entity';

@Entity({ name: 'functional_groups' })
export class FunctionalGroup extends BaseEntity {
  @Field()
  @Column({ type: 'varchar', length: 50 })
  title: string;

  @Field()
  @Column({ type: 'varchar', length: 200 })
  description: string;
}
