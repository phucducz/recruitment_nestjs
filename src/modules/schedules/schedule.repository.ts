import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { CreateScheduleDto } from 'src/dto/schedules/create-schedule.dto';
import { Schedule } from 'src/entities/schedule.entity';

@Injectable()
export class ScheduleRepository {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async create(
    createScheduleDto: ICreate<CreateScheduleDto & Pick<Schedule, 'usersJob'>>,
  ): Promise<Schedule> {
    const { createBy, variable, transactionalEntityManager } =
      createScheduleDto;
    const createParams = {
      createAt: new Date().toString(),
      createBy,
      date: variable.date,
      ...(variable.note && { note: variable.note }),
      ...(variable.usersJob && { usersJob: variable.usersJob }),
    } as Schedule;

    if (transactionalEntityManager) {
      return await (transactionalEntityManager as EntityManager).save(
        Schedule,
        createParams,
      );
    }

    return await this.scheduleRepository.save(createParams);
  }
}
