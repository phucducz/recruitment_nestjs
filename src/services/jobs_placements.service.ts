import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { CreateJobsPlacementDto } from 'src/dto/jobs_placement/create-jobs_placement.dto';
import { UpdateJobsPlacementDto } from 'src/dto/jobs_placement/update-jobs_placement.dto';
import { JobsPlacement } from 'src/entities/jobs_placement.entity';
import { JobsPlacementsRepository } from 'src/modules/jobs_placements/jobs_placements.repository';
import { JobsService } from './jobs.service';
import { PlacementsService } from './placements.service';

@Injectable()
export class JobsPlacementsService {
  constructor(
    @Inject(JobsPlacementsRepository)
    private readonly jobsPlacementRepository: JobsPlacementsRepository,
    @Inject(forwardRef(() => JobsService))
    private readonly jobsService: JobsService,
    @Inject(PlacementsService)
    private readonly placementsService: PlacementsService,
  ) {}

  async findByJobsId(jobsId: number) {
    return await this.jobsPlacementRepository.findByJobId(jobsId);
  }

  async deleteByJobId(jobId: number) {
    return await this.jobsPlacementRepository.deleteByJobId(jobId);
  }

  findAll() {
    return `This action returns all jobsPlacements`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jobsPlacement`;
  }

  update(id: number, updateJobsPlacementDto: UpdateJobsPlacementDto) {
    return `This action updates a #${id} jobsPlacement`;
  }

  async create(createJobsPlacementDto: ICreate<CreateJobsPlacementDto>) {
    const { variable } = createJobsPlacementDto;

    return await this.jobsPlacementRepository.create({
      ...createJobsPlacementDto,
      variable: {
        ...variable,
        job: await this.jobsService.findById(variable.jobsId),
        placements: await this.placementsService.findByIds(
          variable.placementIds,
        ),
      },
    });
  }

  async remove(
    removeJobPlacementDTO: IDelete<
      Pick<JobsPlacement, 'jobsId' | 'placementsId'>
    >,
  ) {
    return await this.jobsPlacementRepository.remove(removeJobPlacementDTO);
  }

  async removeMany(
    removeJobPlacementsDTO: IDeleteMany<
      Pick<JobsPlacement, 'jobsId' | 'placementsId'>
    >,
  ) {
    const { variables, transactionalEntityManager } = removeJobPlacementsDTO;

    return await Promise.all(
      variables.map((variable) =>
        this.remove({ variable, transactionalEntityManager }),
      ),
    );
  }
}
