import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import {
  Between,
  DataSource,
  EntityManager,
  FindOneOptions,
  FindOptionsSelect,
  Raw,
  Repository,
  UpdateResult,
} from 'typeorm';

import { ENTITIES, removeColumns } from 'src/common/utils/constants';
import {
  filterColumns,
  formatParams,
  getPaginationParams,
} from 'src/common/utils/function';
import { CreateDesiredJobDto } from 'src/dto/desired_jobs/create-desired_job.dto';
import { UpdateDesiredJobDto } from 'src/dto/desired_jobs/update-desired_job.dto';
import { Approval } from 'src/entities/approval.entity';
import { DesiredJob } from 'src/entities/desired_job.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class DesiredJobsRepository {
  constructor(
    @InjectRepository(DesiredJob)
    private readonly desiredJobRepository: Repository<DesiredJob>,
    private readonly dataSource: DataSource,
  ) {}

  private readonly userFields = filterColumns(ENTITIES.FIELDS.USER, [
    ...removeColumns,
    'password',
  ]) as FindOptionsSelect<User>;

  private readonly desiredJobSelect = filterColumns(
    ENTITIES.FIELDS.DESIRED_JOB,
    ['updateBy', 'updateAt', 'createBy', 'approveBy'],
  ) as FindOptionsSelect<DesiredJob>;

  private readonly desiredJobOptions = {
    relations: {
      user: true,
      creator: true,
      updater: true,
      jobField: true,
      approvals: {
        status: true,
      },
      desiredJobsPlacement: {
        placement: true,
      },
      desiredJobsPosition: {
        jobPosition: true,
      },
    },
    select: {
      ...this.desiredJobSelect,
      user: {
        id: true,
        email: true,
        fullName: true,
      },
      desiredJobsPlacement: {
        desiredJobsId: true,
        placementsId: true,
        placement: { title: true },
      },
      desiredJobsPosition: {
        desiredJobsId: true,
        jobPositionsId: true,
        jobPosition: { title: true },
      },
      jobField: {
        id: true,
        title: true,
      },
      approvals: {
        id: true,
        status: { id: true, code: true, title: true },
      },
      creator: { id: true, fullName: true },
      updater: { id: true, fullName: true },
    },
  } as FindOneOptions<DesiredJob>;

  private readonly updatedDesiredJobOptions: FindOneOptions<DesiredJob> = {
    relations: [
      'user',
      'user.placement',
      'user.achivement',
      'user.jobPosition',
      'user.userSkills',
      'user.userSkills.skill',
      'user.userLanguages',
      'user.userLanguages.foreignLanguage',
      'user.curriculumVitae',
      'user.workExperiences',
      'user.workExperiences.placement',
      'user.workExperiences.jobCategory',
      'user.workExperiences.jobPosition',
      'jobField',
      'desiredJobsPosition',
      'desiredJobsPlacement',
      'desiredJobsPlacement.placement',
      'desiredJobsPosition.jobPosition',
      'creator',
      'updater',
    ],
    select: {
      user: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        companyUrl: true,
        companyName: true,
        phoneNumber: true,
        jobPosition: {
          id: true,
          title: true,
        },
        placement: {
          id: true,
          title: true,
        },
        achivement: {
          id: true,

          description: true,
        },
        desiredJob: {
          totalYearExperience: true,
        },
        userSkills: {
          level: true,
          usersId: true,
          skillsId: true,
          skill: {
            id: true,
            title: true,
          },
        },
        userLanguages: {
          level: true,
          usersId: true,
          foreignLanguagesId: true,
          foreignLanguage: {
            id: true,
            title: true,
            imageUrl: true,
          },
        },
        curriculumVitae: {
          id: true,
          url: true,
          fileName: true,
          isDeleted: true,
        },
        workExperiences: {
          id: true,
          endDate: true as any,
          startDate: true as any,
          companyName: true,
          description: true,
          isWorking: true,
          placement: {
            id: true,
            title: true,
          },
          jobCategory: {
            id: true,
            name: true,
            description: true,
          },
          jobPosition: {
            id: true,
            title: true,
          },
        },
      },
      desiredJobsPlacement: {
        desiredJobsId: true,
        placementsId: true,
        placement: { id: true, title: true },
      },
      desiredJobsPosition: {
        desiredJobsId: true,
        jobPositionsId: true,
        jobPosition: { id: true, title: true },
      },
      creator: { id: true, fullName: true },
      updater: { id: true, fullName: true },
    },
  };

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

  async findAll(desiredJobsQueries: IFindDesiredJobsQueries) {
    const {
      type,
      page,
      pageSize,
      fullName,
      statusId,
      jobFieldId,
      placementId,
      createdDate,
      ...rest
    } = desiredJobsQueries;
    const paginationParams = getPaginationParams({ page, pageSize });

    const enhancedOptions: FindOneOptions<DesiredJob> =
      type === 'more'
        ? {
            relations: {
              ...this.desiredJobOptions.relations,
              user: {
                placement: true,
                achivement: true,
                curriculumVitae: true,
                userLanguages: {
                  foreignLanguage: true,
                },
              },
            },
            select: {
              ...this.desiredJobOptions.select,
              user: {
                ...this.userFields,
                placement: { id: true, title: true },
                achivement: { id: true, description: true },
                curriculumVitae: filterColumns(
                  ENTITIES.FIELDS.CURRICULUM_VITAE,
                  removeColumns,
                ),
                userLanguages: {
                  level: true,
                  foreignLanguage: {
                    id: true,
                    title: true,
                    imageUrl: true,
                  },
                },
              },
            },
          }
        : this.desiredJobOptions;

    return await this.desiredJobRepository.findAndCount({
      where: {
        ...(fullName && {
          user: {
            fullName: Raw((value) => `${value} ILIKE :fullName`, {
              fullName: `%${fullName}%`,
            }),
          },
        }),
        ...(jobFieldId && { jobField: { id: +jobFieldId } }),
        ...(placementId && {
          desiredJobsPlacement: { placement: { id: +placementId } },
        }),
        ...(createdDate && {
          createAt: Between(
            dayjs(createdDate).startOf('day').toDate(),
            dayjs(createdDate).endOf('day').toDate(),
          ),
        }),
        ...formatParams(rest),
      },
      order: { createAt: 'DESC' },
      ...enhancedOptions,
      ...paginationParams,
    });
  }

  async findById(id: number) {
    return await this.desiredJobRepository.findOne({
      where: { id },
      ...this.desiredJobOptions,
    });
  }

  async findOneBy(options: FindOneOptions<DesiredJob>) {
    return await this.desiredJobRepository.findOne({
      ...options,
      ...this.desiredJobOptions,
    });
  }

  async findOneByUserId(userId: number) {
    const latestApprovalSubquery = this.dataSource
      .createQueryBuilder(Approval, 'a')
      .select('a.id')
      .where('a.desired_job_id = dj.id')
      .orderBy('a.create_at', 'DESC')
      .limit(1);

    const query = this.desiredJobRepository
      .createQueryBuilder('dj')
      .leftJoin('dj.user', 'user')
      .addSelect(['user.id', 'user.fullName', 'user.email'])

      .leftJoin('dj.creator', 'creator')
      .addSelect(['creator.id', 'creator.fullName'])

      .leftJoin('dj.updater', 'updater')
      .addSelect(['updater.id', 'updater.fullName'])

      .leftJoin('dj.jobField', 'jobField')
      .addSelect(['jobField.id', 'jobField.title'])

      .leftJoin('dj.desiredJobsPlacement', 'djPlacement')
      .addSelect([
        'djPlacement.desiredJobsId',
        'djPlacement.placementsId',
        'djPlacement.placement',
      ])

      .leftJoin('dj.desiredJobsPosition', 'djPosition')
      .addSelect([
        'djPosition.desiredJobsId',
        'djPosition.jobPositionsId',
        'djPosition.jobPosition',
      ])

      .leftJoin(
        'dj.approvals',
        'approval',
        `approval.id = (${latestApprovalSubquery.getQuery()})`,
      )
      .leftJoin('approval.status', 'status')
      .addSelect([
        'approval.id',
        'approval.rejectReason',
        'status.id',
        'status.code',
        'status.title',
      ])

      .leftJoinAndSelect('djPlacement.placement', 'placement')
      .leftJoinAndSelect('djPosition.jobPosition', 'jobPosition')

      .where('user.id = :userId', { userId })
      .setParameters(latestApprovalSubquery.getParameters());

    const result = await query.getOne();

    return { ...result, approvals: result?.approvals?.[0] };
  }

  async retrieveDesiredJob(updatedOptions: {
    id: number;
    transactionalEntityManager?: EntityManager;
  }) {
    const { id, transactionalEntityManager } = updatedOptions;

    const updatedDesiredJob = await (transactionalEntityManager
      ? transactionalEntityManager.findOne(DesiredJob, {
          where: { id },
          ...this.updatedDesiredJobOptions,
        })
      : this.desiredJobRepository.findOne({
          where: { id },
          ...this.updatedDesiredJobOptions,
        }));

    return updatedDesiredJob;
  }

  async update(
    id: number,
    updateDesiredJobDto: IUpdate<
      UpdateDesiredJobDto & Pick<DesiredJob, 'jobField'>
    >,
  ) {
    const { updateBy, variable, transactionalEntityManager } =
      updateDesiredJobDto;

    const paramsUpdate = {
      ...(variable.salaryExpectation && {
        salarayExpectation: variable.salaryExpectation,
      }),
      ...(variable.startAfterOffer && {
        startAfterOffer: variable.startAfterOffer,
      }),
      ...(variable.jobField && { jobField: variable.jobField }),
      ...(variable.totalYearExperience && {
        totalYearExperience: variable.totalYearExperience,
      }),
      updateAt: new Date().toString(),
      updateBy,
    } as Partial<DesiredJob>;

    let result = { affected: 0 } as UpdateResult;

    if (transactionalEntityManager)
      result = await (transactionalEntityManager as EntityManager).update(
        DesiredJob,
        id,
        paramsUpdate,
      );
    else result = await this.desiredJobRepository.update(id, paramsUpdate);

    return result;
  }
}
