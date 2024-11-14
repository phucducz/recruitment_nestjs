import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ENTITIES, removeColumns } from 'src/common/utils/constants';
import { filterColumns } from 'src/common/utils/function';
import { CreateJobsPlacementDto } from 'src/dto/jobs_placement/create-jobs_placement.dto';
import { Job } from 'src/entities/job.entity';

import { JobsPlacement } from 'src/entities/jobs_placement.entity';
import { Placement } from 'src/entities/placement.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class JobsPlacementsRepository {
  constructor(
    @InjectRepository(JobsPlacement)
    private readonly jobsPlacementRepository: Repository<JobsPlacement>,
  ) {}

  async findByJobId(jobsId: number) {
    return await this.jobsPlacementRepository.find({
      where: { jobsId },
      relations: ['placement'],
      select: {
        ...filterColumns(ENTITIES.FIELDS.JOB_PLACEMENT, removeColumns),
        placement: filterColumns(ENTITIES.FIELDS.PLACEMENT, removeColumns),
      },
    });
  }

  async deleteByJobId(jobId: number) {
    return await this.jobsPlacementRepository.delete(jobId);
  }

  async remove(
    removeJobPlacementDTO: IDelete<
      Pick<JobsPlacement, 'jobsId' | 'placementsId'>
    >,
  ) {
    const { variable, transactionalEntityManager } = removeJobPlacementDTO;

    if (transactionalEntityManager) {
      const result = await (transactionalEntityManager as EntityManager).delete(
        JobsPlacement,
        variable,
      );

      return result.affected > 0;
    }

    return await this.jobsPlacementRepository.delete(variable);
  }

  async create(
    createJobsPlacementDto: ICreate<
      CreateJobsPlacementDto & {
        job: Job;
        placements: Placement[];
      }
    >,
  ): Promise<JobsPlacement[]> {
    const { createBy, variable, transactionalEntityManager } =
      createJobsPlacementDto;
    const createParams = {
      createAt: new Date().toString(),
      createBy,
    };

    if (transactionalEntityManager)
      return await Promise.all(
        variable.placements.map((placement) =>
          (transactionalEntityManager as EntityManager).save(JobsPlacement, {
            ...createParams,
            job: variable.job,
            placement,
          } as JobsPlacement),
        ),
      );

    return await Promise.all(
      variable.placements.map((placement) =>
        this.jobsPlacementRepository.save({
          ...createParams,
          job: variable.job,
          placement,
        }),
      ),
    );
  }
}
