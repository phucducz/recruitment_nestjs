import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { Achivement } from 'src/achivements/entities/achivement.entity';
import { BaseEntity } from 'src/base/entities/base.entity';
import { JobPosition } from 'src/job_positions/entities/job_position.entity';
import { Job } from 'src/jobs/entities/job.entity';
import { Role } from 'src/roles/entities/role.entity';
import { UsersForeignLanguage } from 'src/users_foreign_languages/entities/users_foreign_language.entity';
import { UsersJobField } from 'src/users_job_fields/entities/users_job_field.entity';
import { UsersJob } from 'src/users_jobs/entities/users_job.entity';
import { UsersSkill } from 'src/users_skills/entities/users_skill.entity';
import { WorkExperience } from 'src/work_experiences/entities/work_experience.entity';

export enum GENDER_ENUM {
  MALE = 1,
  EMALE = 2,
  OTHER = 3,
}

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  full_name: string;

  @Column({ type: 'varchar', length: 11 })
  phone_number: string;

  @Column({ type: 'varchar', length: 45 })
  email: string;

  @Column({ type: 'varchar', length: 45 })
  user_name: string;

  @Column({ type: 'varchar', length: 45 })
  password: string;

  @Column({ type: 'varchar', length: 45 })
  avatar_url: string;

  @Column({ type: 'enum', enum: GENDER_ENUM })
  gender: number;

  @Column({ type: 'varchar', length: 100 })
  company_name: string;

  @Column({ type: 'varchar', length: 45 })
  company_url: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'roles_id' })
  role: Role;

  @ManyToOne(() => JobPosition, (jobPosition) => jobPosition.users)
  @JoinColumn({ name: 'job_positions_id' })
  jobPosition: JobPosition;

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
