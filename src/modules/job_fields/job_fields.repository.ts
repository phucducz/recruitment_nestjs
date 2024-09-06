import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { JobField } from 'src/entities/job_field.entity';

@Injectable()
export class JobFieldsRepository {
  constructor(
    @InjectRepository(JobField)
    private readonly jobFieldRepository: Repository<JobField>,
  ) {}

  async findById(id: number) {
    const queryBuilder = this.jobFieldRepository
      .createQueryBuilder('jf')
      .select('jf')
      .where('jf.id = :id', { id });
    return (await queryBuilder.getRawOne()) as JobField;
  }

  async findByIds(ids: number[]) {
    return await Promise.all(ids.map(async (id) => await this.findById(id)));
  }
}
