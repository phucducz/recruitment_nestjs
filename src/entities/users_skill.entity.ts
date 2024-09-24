import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { Skill } from 'src/entities/skill.entity';
import { BaseEntityNotId } from './base.entity';
import { User } from './user.entity';

@Entity({ name: 'users_skills' })
export class UsersSkill extends BaseEntityNotId {
  @Field()
  @Column({ type: 'int' })
  level: number;

  @Field()
  @PrimaryColumn({ name: 'users_id', type: 'int' })
  usersId: number;

  @ManyToOne(() => User, (user) => user.userSkills)
  @JoinColumn([{ name: 'users_id', referencedColumnName: 'id' }])
  user: User;

  @Field()
  @PrimaryColumn({ name: 'skills_id', type: 'int' })
  skillsId: number;

  @ManyToOne(() => Skill, (skill) => skill.usersSkills)
  @JoinColumn([{ name: 'skills_id', referencedColumnName: 'id' }])
  skill: Skill;
}
