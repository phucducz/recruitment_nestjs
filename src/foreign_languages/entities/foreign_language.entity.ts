import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from 'src/base/entities/base.entity';
import { UsersForeignLanguage } from 'src/users_foreign_languages/entities/users_foreign_language.entity';

@Entity({ name: 'foreign_languages' })
export class ForeignLanguage extends BaseEntity {
  @Column({ type: 'varchar', length: 45 })
  title: string;

  @OneToMany(
    () => UsersForeignLanguage,
    (usersForeignLanguage) => usersForeignLanguage.foreignLanguage,
  )
  usersForeignLanguage: UsersForeignLanguage[];
}
