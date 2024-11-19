import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  FindOptionsSelect,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';

import dayjs from 'dayjs';
import { ENTITIES, removeColumns } from 'src/common/utils/constants';
import { STATUS_TITLES } from 'src/common/utils/enums';
import { filterColumns, getPaginationParams } from 'src/common/utils/function';
import { CreateScheduleDto } from 'src/dto/schedules/create-schedule.dto';
import { UpdateScheduleDto } from 'src/dto/schedules/update-schedule.dto';
import { Schedule } from 'src/entities/schedule.entity';

@Injectable()
export class ScheduleRepository {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async create(
    createScheduleDto: ICreate<
      CreateScheduleDto & Pick<Schedule, 'usersJob' | 'status'>
    >,
  ): Promise<Schedule> {
    const { createBy, variable, transactionalEntityManager } =
      createScheduleDto;
    const createParams = {
      createAt: new Date().toString(),
      createBy,
      date: variable.date,
      status: variable.status,
      ...(variable.note && { note: variable.note }),
      usersJob: variable.usersJob,
    } as Schedule;

    if (transactionalEntityManager) {
      return await (transactionalEntityManager as EntityManager).save(
        Schedule,
        createParams,
      );
    }

    return await this.scheduleRepository.save(createParams);
  }

  async update(id: number, updateScheduleDto: IUpdate<UpdateScheduleDto>) {
    const { variable, updateBy, transactionalEntityManager } =
      updateScheduleDto;
    const updateParams = {
      date: variable.date,
      ...(variable.note && { note: variable.note }),
      updateAt: new Date().toString(),
      updateBy,
    };

    if (transactionalEntityManager) {
      const result = await (transactionalEntityManager as EntityManager).update(
        Schedule,
        id,
        updateParams,
      );

      return result.affected > 0;
    }

    return (
      (await this.scheduleRepository.update(id, updateParams)).affected > 0
    );
  }

  async remove(deleteScheduleDto: IDelete<{ id: number }>) {
    const { variable, transactionalEntityManager } = deleteScheduleDto;

    if (transactionalEntityManager) {
      const result = await (transactionalEntityManager as EntityManager).delete(
        Schedule,
        variable.id,
      );

      return result.affected > 0;
    }

    return (await this.scheduleRepository.delete(variable.id)).affected > 0;
  }

  async findInterviewSchedules(
    findInterviewScheduleDto: IFindInterviewSchedules,
  ) {
    const { jobsId, usersId } = findInterviewScheduleDto;
    const paginationParams = getPaginationParams({
      page: +findInterviewScheduleDto.page,
      pageSize: +findInterviewScheduleDto.pageSize,
    });

    return await this.scheduleRepository.findAndCount({
      where: {
        usersJob: { usersId: +usersId, jobsId: +jobsId },
        // status: { title: STATUS_TITLES.SCHEDULE_INTERVIEW },
      },
      relations: ['status'],
      select: {
        ...filterColumns(ENTITIES.FIELDS.SCHEDULE, removeColumns),
        status: filterColumns(ENTITIES.FIELDS.STATUS, removeColumns),
      } as FindOptionsSelect<Schedule>,
      ...paginationParams,
    });
  }

  async findUpcomingSchedules(
    findUpcomingInterviews: IFindUpcomingScheduleQueries,
  ) {
    const paginationParams = getPaginationParams({
      ...(findUpcomingInterviews.page && {
        page: +findUpcomingInterviews.page,
      }),
      ...(findUpcomingInterviews.pageSize && {
        pageSize: +findUpcomingInterviews.pageSize,
      }),
    });

    return await this.scheduleRepository.findAndCount({
      where: {
        date: MoreThanOrEqual(dayjs().format('YYYY-MM-DD HH:mm:ss')),
        status: {
          title:
            findUpcomingInterviews.type === 'interviewing'
              ? STATUS_TITLES.SCHEDULE_INTERVIEWING
              : STATUS_TITLES.SCHEDULE_START_WORKING,
        },
      },
      relations: ['usersJob', 'usersJob.user', 'usersJob.job'],
      select: {
        usersJob: {
          usersId: true,
          jobsId: true,
          user: { id: true, fullName: true },
          job: { id: true, title: true },
        },
        ...filterColumns(ENTITIES.FIELDS.SCHEDULE, removeColumns),
      },
      ...paginationParams,
    });
  }
}
