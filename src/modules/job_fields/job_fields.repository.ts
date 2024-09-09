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
    return await this.jobFieldRepository.findOne({ where: { id: id } });
  }

  async findByIds(ids: number[]) {
    return await Promise.all(ids.map(async (id) => await this.findById(id)));
  }
}
