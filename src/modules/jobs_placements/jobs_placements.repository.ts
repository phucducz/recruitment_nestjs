import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ENTITIES, removeColumns } from 'src/common/utils/constants';
import { filterColumns } from 'src/common/utils/function';

import { JobsPlacement } from 'src/entities/jobs_placement.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JobsPlacementsRepository {
  constructor(
    @InjectRepository(JobsPlacement)
    private readonly jobsPlacementRepository: Repository<JobsPlacement>,
  ) {}

  async findByJobId(jobsId: number) {
    return await this.jobsPlacementRepository.find({
      where: { jobsId },
      relations: ['placement'],
      select: {
        ...filterColumns(ENTITIES.FIELDS.JOB_PLACEMENT, removeColumns),
        placement: filterColumns(ENTITIES.FIELDS.PLACEMENT, removeColumns),
      },
    });
  }

  async deleteByJobId(jobId: number) {
    return await this.jobsPlacementRepository.delete(jobId);
  }
}
