import { Injectable } from '@nestjs/common';

import { CreateDesiredJobsPositionDto } from 'src/dto/desired_jobs_positions/create-desired_jobs_position.dto';
import { UpdateDesiredJobsPositionDto } from 'src/dto/desired_jobs_positions/update-desired_jobs_position.dto';

@Injectable()
export class DesiredJobsPositionsService {
  create(createDesiredJobsPositionDto: CreateDesiredJobsPositionDto) {
    return 'This action adds a new desiredJobsPosition';
  }

  findAll() {
    return `This action returns all desiredJobsPositions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} desiredJobsPosition`;
  }

  update(
    id: number,
    updateDesiredJobsPositionDto: UpdateDesiredJobsPositionDto,
  ) {
    return `This action updates a #${id} desiredJobsPosition`;
  }

  remove(id: number) {
    return `This action removes a #${id} desiredJobsPosition`;
  }
}
