import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindManyOptions, Repository } from 'typeorm';

import { CreateDesiredJobsPositionDto } from 'src/dto/desired_jobs_positions/create-desired_jobs_position.dto';
import { DesiredJobsPosition } from 'src/entities/desired_jobs_position.entity';

@Injectable()
export class DesiredJobsPositionRepository {
  constructor(
    @InjectRepository(DesiredJobsPosition)
    private readonly desiredJobsPosition: Repository<DesiredJobsPosition>,
  ) {}

  async findBy(options: FindManyOptions<DesiredJobsPosition>) {
    return await this.desiredJobsPosition.find({
      ...options,
    });
  }

  async create(
    createDesiredJobPositionDto: ICreate<
      Partial<CreateDesiredJobsPositionDto> &
        Pick<DesiredJobsPosition, 'desiredJob' | 'jobPosition'>
    >,
  ) {
    const { createBy, variable, transactionalEntityManager } =
      createDesiredJobPositionDto;
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

  async createMany(
    createManyDesiredJobJobPositionDto: ICreateMany<
      Partial<CreateDesiredJobsPositionDto> &
        Pick<DesiredJobsPosition, 'desiredJob' | 'jobPosition'>
    >,
  ) {
    const { createBy, variables, transactionalEntityManager } =
      createManyDesiredJobJobPositionDto;

    return await Promise.all(
      variables.map((variable) =>
        this.create({ createBy, variable, transactionalEntityManager }),
      ),
    );
  }

  async remove(
    removeDesiredJobJobPositionDto: IDelete<
      Pick<DesiredJobsPosition, 'desiredJobsId' | 'jobPositionsId'>
    >,
  ) {
    const { variable, transactionalEntityManager } =
      removeDesiredJobJobPositionDto;
    const deleteParams = {
      desiredJobsId: variable.desiredJobsId,
      jobPositionsId: variable.jobPositionsId,
    } as DesiredJobsPosition;

    if (transactionalEntityManager) {
      const result = await (transactionalEntityManager as EntityManager).delete(
        DesiredJobsPosition,
        deleteParams,
      );

      return result.affected > 0;
    }

    return (await this.desiredJobsPosition.delete(deleteParams)).affected > 0;
  }

  async removeMany(
    removeManyDesiredJobJobPositionDto: IDelete<
      Pick<DesiredJobsPosition, 'desiredJobsId' | 'jobPositionsId'>[]
    >,
  ) {
    const { variable: variables, transactionalEntityManager } =
      removeManyDesiredJobJobPositionDto;

    return await Promise.all(
      variables.map((variable) =>
        this.remove({ variable, transactionalEntityManager }),
      ),
    );
  }
}
