import { Inject, Injectable } from '@nestjs/common';
import { CreateJobFieldDto } from 'src/dto/job_fields/create-job_field.dto';

import { JobFieldsRepository } from 'src/modules/job_fields/job_fields.repository';

@Injectable()
export class JobFieldsService {
  constructor(
    @Inject() private readonly jobFieldRepository: JobFieldsRepository,
  ) {}

  async findById(id: number) {
    return await this.jobFieldRepository.findById(id);
  }

  async findByIds(ids: number[]) {
    return await this.jobFieldRepository.findByIds(ids);
  }

  async create(createJobField: ICreate<CreateJobFieldDto>) {
    return this.jobFieldRepository.create(createJobField);
  }

  async createMany(createJobField: ICreateMany<CreateJobFieldDto>) {
    return this.jobFieldRepository.createMany(createJobField);
  }
}
