import { Inject, Injectable } from '@nestjs/common';

import { CreateJobDto } from 'src/dto/jobs/create-job.dto';
import { UpdateJobDto } from 'src/dto/jobs/update-job.dto';
import { JobsRepository } from 'src/modules/jobs/jobs.repository';
import { JobCategoriesService } from './job_categories.service';
import { JobFieldsService } from './job_fields.service';
import { JobPositionsService } from './job_positions.service';
import { PlacementsService } from './placements.service';
import { UsersService } from './users.service';
import { WorkTypesService } from './work_types.service';

@Injectable()
export class JobsService {
  constructor(
    @Inject(JobsRepository) private readonly jobRepository: JobsRepository,
    @Inject(JobCategoriesService)
    private readonly jobCategoryService: JobCategoriesService,
    @Inject(JobPositionsService)
    private readonly jobPositionService: JobPositionsService,
    @Inject(JobFieldsService)
    private readonly jobFieldService: JobFieldsService,
    @Inject(UsersService) private readonly userService: UsersService,
    @Inject(WorkTypesService)
    private readonly workTypeService: WorkTypesService,
    @Inject(PlacementsService)
    private readonly placementService: PlacementsService,
  ) {}

  async create(createJob: ICreate<CreateJobDto>) {
    const { variable, createBy } = createJob;

    return this.jobRepository.create({
      ...createJob,
      variable: {
        ...variable,
        jobCategory: await this.jobCategoryService.findById(
          variable.categoriesId,
        ),
        jobPosition: await this.jobPositionService.findById(
          variable.positionsId,
        ),
        jobField: await this.jobFieldService.findById(variable.fieldsId),
        user: await this.userService.findById(createBy),
        workType: await this.workTypeService.findById(variable.workTypesId),
        placements: await Promise.all(
          variable.placementIds.map(async (placement) => {
            return await this.placementService.findById(placement);
          }),
        ),
      },
    });
  }

  async findAll(jobsQueries: IJobQueries) {
    return await this.jobRepository.findAll(jobsQueries);
  }

  async findAllForEmployer(
    jobsQueries: IFIndJobsForEmployerQueries & { usersId: number },
  ) {
    return await this.jobRepository.findAllForEmployer(jobsQueries);
  }

  async findById(id: number) {
    return await this.jobRepository.findById(id);
  }

  async update(id: number, updateJobDto: IUpdate<UpdateJobDto>) {
    const { variable } = updateJobDto;

    return await this.jobRepository.update(id, {
      ...updateJobDto,
      variable: {
        ...variable,
        jobCategory: !variable.categoriesId
          ? undefined
          : await this.jobCategoryService.findById(variable.categoriesId),
        jobPosition: !variable.positionsId
          ? undefined
          : await this.jobPositionService.findById(variable.positionsId),
        jobField: !variable.fieldsId
          ? undefined
          : await this.jobFieldService.findById(variable.fieldsId),
        workType: !variable.workTypesId
          ? undefined
          : await this.workTypeService.findById(variable.workTypesId),
        placements: await Promise.all(
          (variable?.placementIds ?? []).map(async (placement) => {
            return await this.placementService.findById(placement);
          }),
        ),
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} job`;
  }
}
