import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { UsersSkill } from './users_skill.entity';

@Entity({ name: 'skills' })
export class Skill extends BaseEntity {
  @Column({ type: 'varchar', length: 45 })
  title: string;

  @OneToMany(() => UsersSkill, (usersSkills) => usersSkills.skill)
  usersSkills: UsersSkill[];
}
