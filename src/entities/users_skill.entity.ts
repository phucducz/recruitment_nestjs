import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Skill } from 'src/entities/skill.entity';
import { User } from './user.entity';

@Entity({ name: 'users_skills' })
export class UsersSkill {
  @Column({ type: 'int' })
  level: number;

  @PrimaryColumn({ name: 'users_id', type: 'int' })
  users_id: number;

  @ManyToOne(() => User, (user) => user.userSkills)
  @JoinColumn([{ name: 'users_id', referencedColumnName: 'id' }])
  user: User;

  @PrimaryColumn({ name: 'skills_id', type: 'int' })
  skills_id: number;

  @ManyToOne(() => Skill, (skill) => skill.usersSkills)
  @JoinColumn([{ name: 'skills_id', referencedColumnName: 'id' }])
  skill: Skill;
}
