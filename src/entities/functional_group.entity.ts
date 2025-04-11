import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { BaseEntity } from './base.entity';
import { Functional } from './functional.entity';
import { User } from './user.entity';

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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'create_by' })
  creator: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'update_by' })
  updater: User;
}
