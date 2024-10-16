import { Column, Entity, OneToMany } from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { BaseEntity } from './base.entity';
import { UsersForeignLanguage } from './users_foreign_language.entity';

@Entity({ name: 'foreign_languages' })
export class ForeignLanguage extends BaseEntity {
  @Field()
  @Column({ type: 'varchar', name: 'image_url', length: 200, nullable: true })
  imageUrl: string;

  @Field()
  @Column({ type: 'varchar', length: 45 })
  title: string;

  @OneToMany(
    () => UsersForeignLanguage,
    (usersForeignLanguage) => usersForeignLanguage.foreignLanguage,
  )
  usersForeignLanguage: UsersForeignLanguage[];
}
