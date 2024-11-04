import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateDesiredJobDto } from 'src/dto/desired_jobs/create-desired_job.dto';
import { DesiredJob } from 'src/entities/desired_job.entity';

@Injectable()
export class DesiredJobsRepository {
  constructor(
    @InjectRepository(DesiredJob)
    private readonly desiredJobRepository: Repository<DesiredJob>,
  ) {}

  async create(
    createDesiredJobDto: ICreate<
      CreateDesiredJobDto & Pick<DesiredJob, 'jobField' | 'user'>
    >,
  ) {
    const { createBy, variable, transactionalEntityManager } =
      createDesiredJobDto;
    const createParams = {
      createAt: new Date().toString(),
      createBy,
      salarayExpectation: variable.salaryExpectation,
      startAfterOffer: variable.startAfterOffer,
      totalYearExperience: variable.totalYearExperience,
      yearOfBirth: variable.yearOfBirth,
      jobField: variable.jobField,
      user: variable.user,
    };

    if (transactionalEntityManager)
      return (await transactionalEntityManager.save(
        DesiredJob,
        createParams,
      )) as DesiredJob;

    return (await this.desiredJobRepository.save(createParams)) as DesiredJob;
  }

  getDesiredJobRepository() {
    return this.desiredJobRepository;
  }
}
