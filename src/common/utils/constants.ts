import { Achivement } from 'src/entities/achivement.entity';
import { ForeignLanguage } from 'src/entities/foreign_language.entity';
import { JobCategory } from 'src/entities/job_category.entity';
import { JobField } from 'src/entities/job_field.entity';
import { JobPosition } from 'src/entities/job_position.entity';
import { JobsPlacement } from 'src/entities/jobs_placement.entity';
import { Role } from 'src/entities/role.entity';
import { Skill } from 'src/entities/skill.entity';
import { User } from 'src/entities/user.entity';
import { UsersForeignLanguage } from 'src/entities/users_foreign_language.entity';
import { UsersSkill } from 'src/entities/users_skill.entity';
import { WorkType } from 'src/entities/work_type.entity';
import { getEntityFields } from './function';

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
  },
};
