import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { Achivement } from 'src/entities/achivement.entity';
import { Job } from 'src/entities/job.entity';
import { JobPosition } from 'src/entities/job_position.entity';
import { Role } from 'src/entities/role.entity';
import { BaseEntity } from './base.entity';
import { UsersForeignLanguage } from './users_foreign_language.entity';
import { UsersJob } from './users_job.entity';
import { UsersJobField } from './users_job_field.entity';
import { UsersSkill } from './users_skill.entity';
import { WorkExperience } from './work_experience.entity';

export enum GENDER_ENUM {
  MALE = 1,
  EMALE = 2,
  OTHER = 3,
}

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ type: 'varchar', name: 'full_name', length: 100 })
  fullName: string;

  @Column({ type: 'varchar', name: 'phone_number', length: 11, nullable: true })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 45 })
  email: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  password: string;

  @Column({ type: 'varchar', name: 'avatar_url', length: 45, nullable: true })
  avatarUrl: string;

  @Column({
    type: 'varchar',
    name: 'company_name',
    length: 100,
    nullable: true,
  })
  companyName: string;

  @Column({ type: 'varchar', name: 'company_url', length: 45, nullable: true })
  companyUrl: string;

  @Column({ type: 'boolean', name: 'is_active', default: true, nullable: true })
  isActive: boolean;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'roles_id' })
  role: Role;

  @ManyToOne(() => JobPosition, (jobPosition) => jobPosition.users)
  @JoinColumn({ name: 'job_positions_id' })
  jobPosition?: JobPosition;

  @OneToMany(() => UsersSkill, (usersSkills) => usersSkills.user)
  userSkills: UsersSkill[];

  @OneToMany(
    () => UsersForeignLanguage,
    (usersForeignLanguage) => usersForeignLanguage.user,
  )
  userLanguages: UsersForeignLanguage[];

  @OneToMany(() => Achivement, (achivement) => achivement.user)
  achivements: Achivement[];

  @OneToMany(() => WorkExperience, (workExperience) => workExperience)
  workExperiences: WorkExperience[];

  @OneToMany(() => UsersJobField, (usersJobField) => usersJobField.user)
  usersJobFields: UsersJobField[];

  @OneToMany(() => Job, (job) => job.user)
  jobs: Job[];

  @OneToMany(() => UsersJob, (usersJob) => usersJob.user)
  usersJobs: UsersJob[];
}
