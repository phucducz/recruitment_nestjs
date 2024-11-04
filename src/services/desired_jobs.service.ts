import { Inject, Injectable } from '@nestjs/common';

import { CreateDesiredJobDto } from 'src/dto/desired_jobs/create-desired_job.dto';
import { UpdateDesiredJobDto } from 'src/dto/desired_jobs/update-desired_job.dto';
import { DesiredJobsRepository } from 'src/modules/desired_jobs/desired_jobs.repository';
import { DesiredJobsPlacementRepository } from 'src/modules/desired_jobs_placements/desired_jobs_placement.repository';
import { DesiredJobsPositionRepository } from 'src/modules/desired_jobs_positions/desired_jobs_position.repository';
import { JobFieldsRepository } from 'src/modules/job_fields/job_fields.repository';
import { JobPositionsRepository } from 'src/modules/job_positions/job_positions.repository';
import { PlacementsRepository } from 'src/modules/placements/placements.repository';
import { UsersRepository } from 'src/modules/users/users.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class DesiredJobsService {
  constructor(
    @Inject(DesiredJobsRepository)
    private readonly desiredJobRepository: DesiredJobsRepository,
    @Inject(DesiredJobsPlacementRepository)
    private readonly desiredJobsPlacementRepository: DesiredJobsPlacementRepository,
    @Inject(DesiredJobsPositionRepository)
    private readonly desiredJobPositionRepository: DesiredJobsPositionRepository,
    @Inject(PlacementsRepository)
    private readonly placementRepository: PlacementsRepository,
    @Inject(JobPositionsRepository)
    private readonly jobPositionRepository: JobPositionsRepository,
    @Inject(JobFieldsRepository)
    private readonly jobFieldRepository: JobFieldsRepository,
    @Inject(UsersRepository) private readonly userRepository: UsersRepository,
    @Inject(DataSource) private readonly dataSource: DataSource,
  ) {}

  async create(createDesiredJobDto: ICreate<CreateDesiredJobDto>) {
    const { createBy, variable } = createDesiredJobDto;

    return await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        const desiredJob = await this.desiredJobRepository.create({
          ...createDesiredJobDto,
          variable: {
            ...createDesiredJobDto.variable,
            jobField: await this.jobFieldRepository.findById(
              variable.jobFieldsId,
            ),
            user: await this.userRepository.findById(createBy),
          },
          transactionalEntityManager,
        });

        console.log('desiredJob', desiredJob);

        const placements = await this.placementRepository.findByIds(
          variable.jobPlacementIds,
        );

        console.log('placements', placements);

        await Promise.all(
          placements.map((placement) =>
            this.desiredJobsPlacementRepository.create({
              createBy,
              variable: { desiredJob, placement },
              transactionalEntityManager,
            }),
          ),
        );

        const jobPositions = await this.jobPositionRepository.findByIds(
          variable.jobPositionIds,
        );

        console.log('jobPositions', jobPositions);

        await Promise.all(
          jobPositions.map((jobPosition) =>
            this.desiredJobPositionRepository.create({
              createBy,
              variable: { desiredJob, jobPosition },
              transactionalEntityManager,
            }),
          ),
        );

        return desiredJob;
      },
    );
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
