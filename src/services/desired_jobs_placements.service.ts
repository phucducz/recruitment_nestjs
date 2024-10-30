import { Injectable } from '@nestjs/common';

import { CreateDesiredJobsPlacementDto } from 'src/dto/desired_jobs_placements/create-desired_jobs_placement.dto';
import { UpdateDesiredJobsPlacementDto } from 'src/dto/desired_jobs_placements/update-desired_jobs_placement.dto';

@Injectable()
export class DesiredJobsPlacementsService {
  create(createDesiredJobsPlacementDto: CreateDesiredJobsPlacementDto) {
    return 'This action adds a new desiredJobsPlacement';
  }

  findAll() {
    return `This action returns all desiredJobsPlacements`;
  }

  findOne(id: number) {
    return `This action returns a #${id} desiredJobsPlacement`;
  }

  update(
    id: number,
    updateDesiredJobsPlacementDto: UpdateDesiredJobsPlacementDto,
  ) {
    return `This action updates a #${id} desiredJobsPlacement`;
  }

  remove(id: number) {
    return `This action removes a #${id} desiredJobsPlacement`;
  }
}
