import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindManyOptions, Repository } from 'typeorm';

import { CreateDesiredJobsPlacementDto } from 'src/dto/desired_jobs_placements/create-desired_jobs_placement.dto';
import { DesiredJobsPlacement } from 'src/entities/desired_jobs_placement.entity';

@Injectable()
export class DesiredJobsPlacementRepository {
  constructor(
    @InjectRepository(DesiredJobsPlacement)
    private readonly desiredJobPlacementRepository: Repository<DesiredJobsPlacement>,
  ) {}

  async findBy(params: FindManyOptions<DesiredJobsPlacement>) {
    return await this.desiredJobPlacementRepository.find(params);
  }

  async create(
    createDesiredJobsPlacement: ICreate<
      Partial<CreateDesiredJobsPlacementDto> &
        Pick<DesiredJobsPlacement, 'placement' | 'desiredJob'>
    >,
  ) {
    const { transactionalEntityManager, createBy, variable } =
      createDesiredJobsPlacement;
    const createParams = {
      createAt: new Date().toString(),
      createBy,
      placement: variable.placement,
      desiredJob: variable.desiredJob,
    } as DesiredJobsPlacement;
    if (
      transactionalEntityManager &&
      variable?.placement &&
      variable?.desiredJob
    ) {
      await (transactionalEntityManager as EntityManager).save(
        DesiredJobsPlacement,
        this.desiredJobPlacementRepository.create(createParams),
      );
      return;
    }
    await this.desiredJobPlacementRepository.save(createParams);
  }

  async createMany(
    createManyDesiredJobsPlacement: ICreateMany<
      Partial<CreateDesiredJobsPlacementDto> &
        Pick<DesiredJobsPlacement, 'placement' | 'desiredJob'>
    >,
  ) {
    const { createBy, variables, transactionalEntityManager } =
      createManyDesiredJobsPlacement;

    return Promise.all(
      variables.map((variable) =>
        this.create({ createBy, variable, transactionalEntityManager }),
      ),
    );
  }

  async remove(
    removeDesiredJobsPlacementDto: IDelete<
      Pick<DesiredJobsPlacement, 'desiredJobsId' | 'placementsId'>
    >,
  ) {
    const { variable, transactionalEntityManager } =
      removeDesiredJobsPlacementDto;
    const deleteParams = {
      desiredJobsId: variable.desiredJobsId,
      placementsId: variable.placementsId,
    } as DesiredJobsPlacement;

    if (transactionalEntityManager) {
      const result = await (transactionalEntityManager as EntityManager).delete(
        DesiredJobsPlacement,
        deleteParams,
      );

      return result.affected > 0;
    }

    return (
      (await this.desiredJobPlacementRepository.delete(deleteParams)).affected >
      0
    );
  }

  async removeMany(
    removeDesiredJobsPlacementDto: IDelete<
      Pick<DesiredJobsPlacement, 'desiredJobsId' | 'placementsId'>[]
    >,
  ) {
    const { variable: variables, transactionalEntityManager } =
      removeDesiredJobsPlacementDto;
      
    return await Promise.all(
      variables.map((variable) =>
        this.remove({ variable, transactionalEntityManager }),
      ),
    );
  }
}
