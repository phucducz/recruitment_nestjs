import { Inject, Injectable } from '@nestjs/common';
import { CreateJobPositionDto } from 'src/dto/job_positions/create-job_position.dto';

import { JobPositionsRepository } from 'src/modules/job_positions/job_positions.repository';

@Injectable()
export class JobPositionsService {
  constructor(
    @Inject(JobPositionsRepository)
    private readonly jobPositionRepository: JobPositionsRepository,
  ) {}

  async findAll() {
    return await this.jobPositionRepository.findAll();
  }

  async findById(id: number) {
    return await this.jobPositionRepository.findById(id);
  }

  async create(createJobPosition: ICreate<CreateJobPositionDto>) {
    return await this.jobPositionRepository.create(createJobPosition);
  }

  async createMany(createJobPositions: ICreateMany<CreateJobPositionDto>) {
    return await this.jobPositionRepository.createMany(createJobPositions);
  }
}
