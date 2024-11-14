import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { CreateJobRecommendationDto } from 'src/dto/job_recomendations/create-job_recomendation.dto';
import { JobRecommendation } from 'src/entities/job_recomendation.entity';

@Injectable()
export class JobRecommendationRepository {
  constructor(
    @InjectRepository(JobRecommendation)
    private readonly jobRecomendationRepository: Repository<JobRecommendation>,
  ) {}

  async create(
    createJobRecomendationDto: ICreate<
      CreateJobRecommendationDto & { cvUrl: string; fileName: string } & Pick<
          JobRecommendation,
          'job' | 'applicationStatus' | 'jobPosition'
        >
    >,
  ) {
    const { createBy, variable, transactionalEntityManager } =
      createJobRecomendationDto;
    const createParams = {
      fullName: variable.fullName,
      email: variable.email,
      ...(variable.phoneNumber && { phoneNumber: variable.phoneNumber }),
      fileName: variable.fileName,
      cvUrl: variable.cvUrl,
      createAt: new Date().toString(),
      createBy,
      job: variable.job,
      ...(variable.jobPosition && { jobPosition: variable.jobPosition }),
      applicationStatus: variable.applicationStatus,
    } as JobRecommendation;

    if (transactionalEntityManager) {
      return await (transactionalEntityManager as EntityManager).save(
        JobRecommendation,
        createParams,
      );
    }

    return await this.jobRecomendationRepository.save(createParams);
  }
}
