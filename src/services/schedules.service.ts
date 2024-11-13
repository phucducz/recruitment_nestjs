import { Inject, Injectable } from '@nestjs/common';

import { CreateScheduleDto } from 'src/dto/schedules/create-schedule.dto';
import { UpdateScheduleDto } from 'src/dto/schedules/update-schedule.dto';
import { ScheduleRepository } from 'src/modules/schedules/schedule.repository';
import { UsersJobsService } from './users_jobs.service';

@Injectable()
export class SchedulesService {
  constructor(
    @Inject(ScheduleRepository)
    private readonly scheduleRepository: ScheduleRepository,
    @Inject(UsersJobsService)
    private readonly usersJobService: UsersJobsService,
  ) {}

  async create(createScheduleDto: ICreate<CreateScheduleDto>) {
    const { variable } = createScheduleDto;

    return await this.scheduleRepository.create({
      ...createScheduleDto,
      variable: {
        ...variable,
        usersJob: await this.usersJobService.findByCompositePrKey({
          usersId: variable.usersId,
          jobsId: variable.jobsId,
        }),
      },
    });
  }

  findAll() {
    return `This action returns all schedules`;
  }

  findOne(id: number) {
    return `This action returns a #${id} schedule`;
  }

  update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return `This action updates a #${id} schedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }
}
