import { Inject, Injectable } from '@nestjs/common';

import { STATUS_TITLES, STATUS_TYPE_TITLES } from 'src/common/utils/enums';
import { CreateScheduleDto } from 'src/dto/schedules/create-schedule.dto';
import { UpdateScheduleDto } from 'src/dto/schedules/update-schedule.dto';
import { ScheduleRepository } from 'src/modules/schedules/schedule.repository';
import { StatusService } from './status.service';
import { StatusTypesService } from './status_types.service';
import { UsersJobsService } from './users_jobs.service';

@Injectable()
export class SchedulesService {
  constructor(
    @Inject(ScheduleRepository)
    private readonly scheduleRepository: ScheduleRepository,
    @Inject(UsersJobsService)
    private readonly usersJobService: UsersJobsService,
    @Inject(StatusService)
    private readonly statusService: StatusService,
    @Inject(StatusTypesService)
    private readonly statusTypesService: StatusTypesService,
  ) {}

  async create(createScheduleDto: ICreate<CreateScheduleDto>) {
    const { variable } = createScheduleDto;
    const statusType = await this.statusTypesService.findByTitle(
      STATUS_TYPE_TITLES.SCHEDULE,
    );

    return await this.scheduleRepository.create({
      ...createScheduleDto,
      variable: {
        ...variable,
        status: await this.statusService.findByTitle(
          STATUS_TITLES.SCHEDULE_INTERVIEW,
          statusType.id,
        ),
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
