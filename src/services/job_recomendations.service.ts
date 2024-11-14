import { Injectable } from '@nestjs/common';

import { CreateJobRecomendationDto } from 'src/dto/job_recomendations/create-job_recomendation.dto';
import { UpdateJobRecomendationDto } from 'src/dto/job_recomendations/update-job_recomendation.dto';

@Injectable()
export class JobRecomendationsService {
  create(createJobRecomendationDto: CreateJobRecomendationDto) {
    return 'This action adds a new jobRecomendation';
  }

  findAll() {
    return `This action returns all jobRecomendations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jobRecomendation`;
  }

  update(id: number, updateJobRecomendationDto: UpdateJobRecomendationDto) {
    return `This action updates a #${id} jobRecomendation`;
  }

  remove(id: number) {
    return `This action removes a #${id} jobRecomendation`;
  }
}
