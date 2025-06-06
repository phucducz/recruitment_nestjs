import { Inject, Injectable } from '@nestjs/common';

import { CreateScheduleDto } from 'src/dto/schedules/create-schedule.dto';
import { UpdateScheduleDto } from 'src/dto/schedules/update-schedule.dto';
import { ScheduleRepository } from 'src/modules/schedules/schedule.repository';
import { StatusService } from './status.service';
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
  ) {}

  async create(createScheduleDto: ICreate<CreateScheduleDto>) {
    const { variable } = createScheduleDto;

    return await this.scheduleRepository.create({
      ...createScheduleDto,
      variable: {
        ...variable,
        status: await this.statusService.findById(variable.statusId),
        usersJob: await this.usersJobService.findByCompositePrKey({
          usersId: variable.usersId,
          jobsId: variable.jobsId,
        }),
      },
    });
  }

  async findUpcomingSchedules(
    findUpcomingInterviews: IFindUpcomingScheduleQueries,
  ) {
    if (!findUpcomingInterviews.type)
      throw new Error('Giá trị "type" là bắt buộc');

    if (
      findUpcomingInterviews.type !== 'interviewing' &&
      findUpcomingInterviews.type !== 'start_working'
    )
      throw new Error(
        'Giá trị của "type" phải là một trong "interviewing, start_working"',
      );

    return await this.scheduleRepository.findUpcomingSchedules(
      findUpcomingInterviews,
    );
  }

  findAll() {
    return `This action returns all schedules`;
  }

  findOne(id: number) {
    return `This action returns a #${id} schedule`;
  }

  async update(id: number, updateScheduleDto: IUpdate<UpdateScheduleDto>) {
    return await this.scheduleRepository.update(id, updateScheduleDto);
  }

  async remove(id: number) {
    return await this.scheduleRepository.remove({ variable: { id } });
  }

  async findInterviewSchedules(
    findInterviewScheduleDto: IFindInterviewSchedules,
  ) {
    return await this.scheduleRepository.findInterviewSchedules(
      findInterviewScheduleDto,
    );
  }
}