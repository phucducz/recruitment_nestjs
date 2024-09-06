import { Inject, Injectable } from '@nestjs/common';

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
}
