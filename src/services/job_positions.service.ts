import { Inject, Injectable } from '@nestjs/common';

import { JobPositionsRepository } from 'src/modules/job_positions/job_positions.repository';

@Injectable()
export class JobPositionsService {
  constructor(
    @Inject(JobPositionsRepository)
    private readonly jobPositionRepository: JobPositionsRepository,
  ) {}

  async findById(id: number) {
    return await this.jobPositionRepository.findById(id);
  }
}
