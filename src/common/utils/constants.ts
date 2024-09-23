import { JobCategory } from 'src/entities/job_category.entity';
import { JobField } from 'src/entities/job_field.entity';
import { JobPosition } from 'src/entities/job_position.entity';
import { JobsPlacement } from 'src/entities/jobs_placement.entity';
import { User } from 'src/entities/user.entity';
import { WorkType } from 'src/entities/work_type.entity';
import { getEntityFields } from './function';

export const userKeys = [
  'id',
  'createBy',
  'createAt',
  'updateBy',
  'updateAt',
  'fullName',
  'phoneNumber',
  'email',
  'password',
  'avatarUrl',
  'companyName',
  'companyUrl',
  'isActive',
];

export const ENTITIES = {
  FIELDS: {
    USER: getEntityFields(User),
    JOB_POSITION: getEntityFields(JobPosition),
    JOB_FIELD: getEntityFields(JobField),
    JOB_PLACEMENT: getEntityFields(JobsPlacement),
    WORK_TYPE: getEntityFields(WorkType),
    JOB_CATEGORY: getEntityFields(JobCategory),
  },
};
