import { Inject, Injectable } from '@nestjs/common';

import { CreateJobsPlacementDto } from 'src/dto/jobs_placement/create-jobs_placement.dto';
import { UpdateJobsPlacementDto } from 'src/dto/jobs_placement/update-jobs_placement.dto';
import { JobsPlacementsRepository } from 'src/modules/jobs_placements/jobs_placements.repository';

@Injectable()
export class JobsPlacementsService {
  constructor(
    @Inject(JobsPlacementsRepository)
    private readonly jobsPlacementRepository: JobsPlacementsRepository,
  ) {}

  async findByJobsId(jobsId: number) {
    return await this.jobsPlacementRepository.findByJobId(jobsId);
  }

  async deleteByJobId(jobId: number) {
    return await this.jobsPlacementRepository.deleteByJobId(jobId);
  }

  create(createJobsPlacementDto: CreateJobsPlacementDto) {
    return 'This action adds a new jobsPlacement';
  }

  findAll() {
    return `This action returns all jobsPlacements`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jobsPlacement`;
  }

  update(id: number, updateJobsPlacementDto: UpdateJobsPlacementDto) {
    return `This action updates a #${id} jobsPlacement`;
  }

  remove(id: number) {
    return `This action removes a #${id} jobsPlacement`;
  }
}
