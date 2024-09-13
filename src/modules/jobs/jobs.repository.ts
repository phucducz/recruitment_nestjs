import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Job } from 'src/entities/job.entity';

@Injectable()
export class JobsRepository {
  private readonly userKeys = [
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

  constructor(
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
  ) {}

  async findAll() {
    return await this.jobRepository.find({
      relations: [
        'user',
        'jobPosition',
        'jobField',
        'jobsPlacements',
        'workType',
        'jobCategory',
      ],
      select: {
        user: {
          ...this.userKeys.reduce((acc, key) => {
            if (key === 'password') acc[key] = false;
            else acc[key] = true;

            return acc;
          }, {}),
        },
      },
    });
  }

  async findById(id: number) {
    return await this.jobRepository.find({
      where: { id: id },
      relations: [
        'users',
        'placements',
        'jobs_placements',
        'work_types',
        'job_categories',
        'job_fields',
      ],
    });
  }
}
