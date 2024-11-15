import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

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
}
