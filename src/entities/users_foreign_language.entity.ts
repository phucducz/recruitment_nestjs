import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { ForeignLanguage } from 'src/entities/foreign_language.entity';
import { User } from './user.entity';

@Entity({ name: 'users_foreign_languages' })
export class UsersForeignLanguage {
  @PrimaryColumn({ name: 'users_id', type: 'int' })
  users_id: number;

  @ManyToOne(() => User, (user) => user.userLanguages)
  @JoinColumn([{ name: 'users_id', referencedColumnName: 'id' }])
  user: User;

  @PrimaryColumn({ name: 'foreign_languages_id', type: 'int' })
  foreign_languages_id: number;

  @ManyToOne(() => ForeignLanguage, (foreignLanguage) => foreignLanguage)
  @JoinColumn([{ name: 'foreign_languages_id', referencedColumnName: 'id' }])
  foreignLanguage: ForeignLanguage;
}
