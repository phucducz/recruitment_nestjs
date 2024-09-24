import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { ForeignLanguage } from 'src/entities/foreign_language.entity';
import { BaseEntityNotId } from './base.entity';
import { User } from './user.entity';

@Entity({ name: 'users_foreign_languages' })
export class UsersForeignLanguage extends BaseEntityNotId {
  @Field()
  @Column({ type: 'int' })
  level: number;

  @Field()
  @PrimaryColumn({ name: 'users_id', type: 'int' })
  usersId: number;

  @ManyToOne(() => User, (user) => user.userLanguages)
  @JoinColumn([{ name: 'users_id', referencedColumnName: 'id' }])
  user: User;

  @Field()
  @PrimaryColumn({ name: 'foreign_languages_id', type: 'int' })
  foreignLanguagesId: number;

  @ManyToOne(() => ForeignLanguage, (foreignLanguage) => foreignLanguage)
  @JoinColumn([{ name: 'foreign_languages_id', referencedColumnName: 'id' }])
  foreignLanguage: ForeignLanguage;
}
