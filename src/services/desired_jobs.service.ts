import { Injectable } from '@nestjs/common';

import { CreateDesiredJobDto } from 'src/dto/desired_jobs/create-desired_job.dto';
import { UpdateDesiredJobDto } from 'src/dto/desired_jobs/update-desired_job.dto';

@Injectable()
export class DesiredJobsService {
  create(createDesiredJobDto: CreateDesiredJobDto) {
    return 'This action adds a new desiredJob';
  }

  findAll() {
    return `This action returns all desiredJobs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} desiredJob`;
  }

  update(id: number, updateDesiredJobDto: UpdateDesiredJobDto) {
    return `This action updates a #${id} desiredJob`;
  }

  remove(id: number) {
    return `This action removes a #${id} desiredJob`;
  }
}
