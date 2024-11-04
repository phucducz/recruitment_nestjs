import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { CreateDesiredJobsPlacementDto } from 'src/dto/desired_jobs_placements/create-desired_jobs_placement.dto';
import { DesiredJobsPlacement } from 'src/entities/desired_jobs_placement.entity';

@Injectable()
export class DesiredJobsPlacementRepository {
  constructor(
    @InjectRepository(DesiredJobsPlacement)
    private readonly desiredJobPlacementRepository: Repository<DesiredJobsPlacement>,
  ) {}

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
}
