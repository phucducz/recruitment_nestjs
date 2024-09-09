import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { JobPosition } from 'src/entities/job_position.entity';

@Injectable()
export class JobPositionsRepository {
  constructor(
    @InjectRepository(JobPosition)
    private readonly jobPositionRepository: Repository<JobPosition>,
  ) {}

  async findById(id: number): Promise<JobPosition> {
    return await this.jobPositionRepository.findOne({
      where: {
        id: id,
      },
    });
  }
}
