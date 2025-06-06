import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { Achivement } from 'src/entities/achivement.entity';
import { Job } from 'src/entities/job.entity';
import { JobPosition } from 'src/entities/job_position.entity';
import { Role } from 'src/entities/role.entity';
import { BaseEntity } from './base.entity';
import { CurriculumVitae } from './curriculum_vitae';
import { DesiredJob } from './desired_job.entity';
import { Placement } from './placement.entity';
import { RefreshToken } from './refresh_token.entity';
import { Status } from './status.entity';
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
  @Field()
  @Column({ type: 'varchar', name: 'full_name', length: 100 })
  fullName: string;

  @Field()
  @Column({ type: 'varchar', name: 'phone_number', length: 11, nullable: true })
  phoneNumber: string;

  @Field()
  @Column({ type: 'varchar', length: 45, unique: true })
  email: string;

  @Field()
  @Column({ type: 'varchar', length: 200, nullable: true })
  password: string;

  @Field()
  @Column({ type: 'varchar', name: 'avatar_url', length: 1000, nullable: true })
  avatarUrl: string;

  @Field()
  @Column({
    type: 'varchar',
    name: 'company_name',
    length: 100,
    nullable: true,
  })
  companyName: string;

  @Field()
  @Column({ type: 'varchar', name: 'company_url', length: 45, nullable: true })
  companyUrl: string;

  @ManyToOne(() => Status, (status) => status.users, { nullable: true })
  @JoinColumn({ name: 'status_id', referencedColumnName: 'id' })
  status: Status;

  @ManyToOne(() => Role, (role) => role.users, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'roles_id', referencedColumnName: 'id' })
  role: Role;

  @ManyToOne(() => JobPosition, (jobPosition) => jobPosition.users)
  @JoinColumn({ name: 'job_positions_id', referencedColumnName: 'id' })
  jobPosition?: JobPosition;

  @OneToMany(() => UsersSkill, (usersSkills) => usersSkills.user)
  userSkills: UsersSkill[];

  @OneToMany(
    () => UsersForeignLanguage,
    (usersForeignLanguage) => usersForeignLanguage.user,
  )
  userLanguages: UsersForeignLanguage[];

  @OneToOne(() => Achivement, (achivement) => achivement.user)
  @JoinColumn({ name: 'achivements_id' })
  achivement: Achivement;

  @OneToMany(() => WorkExperience, (workExperience) => workExperience.user)
  workExperiences: WorkExperience[];

  @OneToMany(() => UsersJobField, (usersJobField) => usersJobField.user)
  usersJobFields: UsersJobField[];

  @OneToMany(() => Job, (job) => job.user)
  jobs: Job[];

  @OneToMany(() => UsersJob, (usersJob) => usersJob.user)
  usersJobs: UsersJob[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  @OneToMany(() => CurriculumVitae, (curriculumVitae) => curriculumVitae.user)
  curriculumVitae: CurriculumVitae;

  @OneToOne(() => DesiredJob, (desiredJob) => desiredJob.user)
  desiredJob: DesiredJob;

  @ManyToOne(() => Placement, (placement) => placement.users)
  @JoinColumn({ name: 'placements_id', referencedColumnName: 'id' })
  placement: Placement;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'create_by' })
  creator: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'update_by' })
  updater: User;
}
