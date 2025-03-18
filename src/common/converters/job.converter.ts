import { Injectable } from '@nestjs/common';

import { Job } from 'src/entities/job.entity';
import { JobCategory } from 'src/entities/job_category.entity';
import { JobField } from 'src/entities/job_field.entity';
import { JobPosition } from 'src/entities/job_position.entity';
import { User } from 'src/entities/user.entity';
import { WorkType } from 'src/entities/work_type.entity';
import { BaseConverter } from './base.converter';

@Injectable()
export class JobConverter extends BaseConverter {
  convert(job: any): Partial<Job> {
    return {
      id: job.j_id,
      createBy: job.j_create_by,
      createAt: job.j_create_at,
      updateBy: job.j_update_by,
      updateAt: job.j_update_at,
      title: job.j_title,
      salaryMin: job.j_salary_min,
      salaryMax: job.j_salary_max,
      maxExpYearRequired: job.j_max_exp_year_required,
      minExpYearRequired: job.j_min_exp_year_required,
      applicationDeadline: job.j_application_deadline,
      salaryCurrency: job.j_salary_currency,
      description: job.j_description,
      requirements: job.j_requirements,
      benefits: job.j_benefits,
      quantity: job.j_quantity,
      user: {
        id: job.u_id,
        fullName: job.u_full_name,
        phoneNumber: job.u_phone_number,
        email: job.u_email,
        avatarUrl: job.u_avatar_url,
        companyName: job.u_company_name,
        companyUrl: job.u_company_url,
        status: job.u_status,
      } as User,
      ...(job.jp_id && {
        jobPosition: {
          id: job.jp_id,
          title: job.jp_title,
        } as JobPosition,
      }),
      ...(job.jf_id && {
        jobField: {
          id: job.jf_id,
          title: job.jf_title,
        } as JobField,
      }),
      ...(job.wt_id && {
        workType: {
          id: job.wt_id,
          title: job.wt_title,
        } as WorkType,
      }),
      ...(job.jc_id && {
        jobCategory: {
          id: job.jc_id,
          name: job.jc_name,
          description: job.jc_description,
        } as JobCategory,
      }),
    };
  }
}
