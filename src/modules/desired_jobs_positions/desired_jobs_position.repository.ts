import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import { CreateDesiredJobsPositionDto } from 'src/dto/desired_jobs_positions/create-desired_jobs_position.dto';
import { DesiredJobsPosition } from 'src/entities/desired_jobs_position.entity';

@Injectable()
export class DesiredJobsPositionRepository {
  constructor(
    @InjectRepository(DesiredJobsPosition)
    private readonly desiredJobsPosition: Repository<DesiredJobsPosition>,
  ) {}

  async create(
    createDesiredJobDto: ICreate<
      Partial<CreateDesiredJobsPositionDto> &
        Pick<DesiredJobsPosition, 'desiredJob' | 'jobPosition'>
    >,
  ) {
    const { createBy, variable, transactionalEntityManager } =
      createDesiredJobDto;
    const createParams = {
      createAt: new Date().toString(),
      createBy,
      desiredJob: variable.desiredJob,
      jobPosition: variable.jobPosition,
    } as DesiredJobsPosition;
    if (transactionalEntityManager)
      return await transactionalEntityManager.save(
        DesiredJobsPosition,
        this.desiredJobsPosition.create(createParams),
      );
    return await this.desiredJobsPosition.save(createParams);
  }

  async findBy(options: FindManyOptions<DesiredJobsPosition>) {
    return await this.desiredJobsPosition.find({
      ...options,
    });
  }
}
