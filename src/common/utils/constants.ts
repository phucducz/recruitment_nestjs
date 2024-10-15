import { Achivement } from 'src/entities/achivement.entity';
import { BaseEntity } from 'src/entities/base.entity';
import { CurriculumVitae } from 'src/entities/curriculum_vitae';
import { ForeignLanguage } from 'src/entities/foreign_language.entity';
import { Job } from 'src/entities/job.entity';
import { JobCategory } from 'src/entities/job_category.entity';
import { JobField } from 'src/entities/job_field.entity';
import { JobPosition } from 'src/entities/job_position.entity';
import { JobsPlacement } from 'src/entities/jobs_placement.entity';
import { Placement } from 'src/entities/placement.entity';
import { Role } from 'src/entities/role.entity';
import { Skill } from 'src/entities/skill.entity';
import { User } from 'src/entities/user.entity';
import { UsersForeignLanguage } from 'src/entities/users_foreign_language.entity';
import { UsersJob } from 'src/entities/users_job.entity';
import { UsersJobField } from 'src/entities/users_job_field.entity';
import { UsersSkill } from 'src/entities/users_skill.entity';
import { WorkExperience } from 'src/entities/work_experience.entity';
import { WorkType } from 'src/entities/work_type.entity';
import { filterColumns } from './function';

export const MANY_TO_MANY_ENTITIES = [
  'UsersForeignLanguage',
  'UsersSkill',
  'JobsPlacement',
  'UsersJobField',
  'UsersJob',
];

const getEntityFields = (entity: typeof BaseEntity | any): string[] => {
  const entityFields =
    Reflect.getMetadata(`fields_${entity.name}`, entity.prototype) || [];

  if (MANY_TO_MANY_ENTITIES.includes(entity.name)) return entityFields;

  const baseFields =
    Reflect.getMetadata('fields_BaseEntity', BaseEntity.prototype) || [];

  return [...new Set([...baseFields, ...entityFields])];
};

export const ENTITIES = {
  FIELDS: {
    USER: getEntityFields(User),
    JOB_POSITION: getEntityFields(JobPosition),
    JOB_FIELD: getEntityFields(JobField),
    JOB_PLACEMENT: getEntityFields(JobsPlacement),
    WORK_TYPE: getEntityFields(WorkType),
    JOB_CATEGORY: getEntityFields(JobCategory),
    ROLE: getEntityFields(Role),
    USER_SKILLS: getEntityFields(UsersSkill),
    ACHIVEMENT: getEntityFields(Achivement),
    SKILLS: getEntityFields(Skill),
    USERS_FOREIGN_LANGUAGE: getEntityFields(UsersForeignLanguage),
    FOREIGN_LANGUAGE: getEntityFields(ForeignLanguage),
    WORK_EXPERIENCE: getEntityFields(WorkExperience),
    PLACEMENT: getEntityFields(Placement),
    USERS_JOB_FIELD: getEntityFields(UsersJobField),
    CURRICULUM_VITAE: getEntityFields(CurriculumVitae),
    JOB: getEntityFields(Job),
    USERS_JOB: getEntityFields(UsersJob),
  },
};

export const removeColumns = ['updateBy', 'updateAt', 'createBy', 'createAt'];

export const MAX_SEND_COUNT = 3;

export const BLOCK_TIME = 60 * 1000 * 15;

export const jobRelations = {
  entites: [
    'user',
    'jobPosition',
    'jobField',
    'jobsPlacements',
    'workType',
    'jobCategory',
    'jobsPlacements.placement',
  ],
  fields: [
    filterColumns(ENTITIES.FIELDS.USER, ['password', ...removeColumns]),
    filterColumns(ENTITIES.FIELDS.JOB_POSITION, removeColumns),
    filterColumns(ENTITIES.FIELDS.JOB_FIELD, removeColumns),
    filterColumns(ENTITIES.FIELDS.JOB_PLACEMENT, removeColumns),
    filterColumns(ENTITIES.FIELDS.WORK_TYPE, removeColumns),
    filterColumns(ENTITIES.FIELDS.JOB_CATEGORY, removeColumns),
  ],
};

export const jobSelectColumns = filterColumns(ENTITIES.FIELDS.JOB, [
  'salaryMin',
  'salaryMax',
  'salaryMin',
  'salaryMax',
  'maxExpYearRequired',
  'minExpYearRequired',
  'applicationDeadline',
  'salaryCurrency',
  'requirements',
  'benefits',
]);

export const jobSelectRelationColumns = jobRelations.entites.reduce(
  (acc, entity, index) => {
    acc[entity] = jobRelations.fields[index];
    return acc;
  },
  {},
) as any;
