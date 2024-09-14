import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CreateJobDto } from 'src/dto/jobs/create-job.dto';
import { Job } from 'src/entities/job.entity';
import { JobsPlacement } from 'src/entities/jobs_placement.entity';
import { JobCategoriesService } from 'src/services/job_categories.service';
import { JobFieldsService } from 'src/services/job_fields.service';
import { JobPositionsService } from 'src/services/job_positions.service';
import { PlacementsService } from 'src/services/placements.service';
import { UsersService } from 'src/services/users.service';
import { WorkTypesService } from 'src/services/work_types.service';

@Injectable()
export class JobsRepository {
  constructor(
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
    @Inject(DataSource) private readonly dataSource: DataSource,
    @Inject(JobCategoriesService)
    private readonly jobCategoryService: JobCategoriesService,
    @Inject(JobPositionsService)
    private readonly jobPositionService: JobPositionsService,
    @Inject(JobFieldsService)
    private readonly jobFieldService: JobFieldsService,
    @Inject(UsersService) private readonly userService: UsersService,
    @Inject(WorkTypesService)
    private readonly workTypeService: WorkTypesService,
    @InjectRepository(JobsPlacement)
    private readonly jobPlacementRepository: Repository<JobsPlacement>,
    @Inject(PlacementsService)
    private readonly placementService: PlacementsService,
  ) {}

  private readonly logger = new Logger(JobsRepository.name);
  private readonly userKeys = [
    'id',
    'createBy',
    'createAt',
    'updateBy',
    'updateAt',
    'fullName',
    'phoneNumber',
    'email',
    'password',
    'avatarUrl',
    'companyName',
    'companyUrl',
    'isActive',
  ];

  async findAll() {
    return await this.jobRepository.find({
      relations: [
        'user',
        'jobPosition',
        'jobField',
        'jobsPlacements',
        'workType',
        'jobCategory',
      ],
      select: {
        user: {
          ...this.userKeys.reduce((acc, key) => {
            if (key === 'password') acc[key] = false;
            else acc[key] = true;

            return acc;
          }, {}),
        },
      },
    });
  }

  async findById(id: number) {
    return await this.jobRepository.find({
      where: { id: id },
      relations: [
        'user',
        'jobPosition',
        'jobField',
        'jobsPlacements',
        'workType',
        'jobCategory',
      ],
      select: {
        user: {
          ...this.userKeys.reduce((acc, key) => {
            if (key === 'password') acc[key] = false;
            else acc[key] = true;

            return acc;
          }, {}),
        },
      },
    });
  }

  async create(createJob: ICreate<CreateJobDto>) {
    try {
      const { createBy, variable } = createJob;
      let newJobRecord: Job | null = null;

      await this.dataSource.manager.transaction(
        async (transactionalEntityManager) => {
          newJobRecord = await transactionalEntityManager.save(
            Job,
            this.jobRepository.create({
              applicationDeadline: variable.deadline,
              createAt: new Date().toString(),
              createBy,
              description: variable.description,
              endExpYearRequired: variable.endExpYearRequired,
              endPrice: variable.endPrice,
              requirement: variable.requirement,
              startExpYearRequired: variable.startExpYearRequired,
              startPrice: variable.startPrice,
              title: variable.title,
              whyLove: variable.whyLoveWorkingHere,
              workTime: variable.workTime,
              jobCategory: await this.jobCategoryService.findById(
                variable.categoriesId,
              ),
              jobPosition: await this.jobPositionService.findById(
                variable.positionsId,
              ),
              jobField: await this.jobFieldService.findById(variable.fieldsId),
              user: await this.userService.findById(createBy),
              workType: await this.workTypeService.findById(
                variable.workTypesId,
              ),
            }),
          );

          const placements = await Promise.all(
            variable.placements.map(async (placement) => {
              const { amount, detailAddress, id } = placement;
              const placementEntity = await this.placementService.findById(id);

              return {
                ...placementEntity,
                amount: amount,
                detailAddress: detailAddress,
              };
            }),
          );

          await Promise.all(
            placements.map(async (placement) => {
              const { amount, detailAddress, ...others } = placement;

              await transactionalEntityManager.save(
                JobsPlacement,
                this.jobPlacementRepository.create({
                  amount: amount,
                  detailAddress: detailAddress,
                  job: newJobRecord,
                  jobsId: newJobRecord.id,
                  placement: others,
                  placementsId: others.id,
                }),
              );
            }),
          );
        },
      );

      return newJobRecord;
    } catch (error) {
      this.logger.log(error);
      return null;
    }
  }
}
