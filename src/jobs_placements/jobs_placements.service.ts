import { Injectable } from '@nestjs/common';
import { CreateJobsPlacementDto } from './dto/create-jobs_placement.dto';
import { UpdateJobsPlacementDto } from './dto/update-jobs_placement.dto';

@Injectable()
export class JobsPlacementsService {
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
