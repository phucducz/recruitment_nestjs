import { Column, Entity, OneToMany } from 'typeorm';

import { UsersSkill } from 'src/users_skills/entities/users_skill.entity';
import { BaseEntity } from 'src/base/entities/base.entity';

@Entity({ name: 'skills' })
export class Skill extends BaseEntity {
  @Column({ type: 'varchar', length: 45 })
  title: string;

  @OneToMany(() => UsersSkill, (usersSkills) => usersSkills.skill)
  usersSkills: UsersSkill[];
}
