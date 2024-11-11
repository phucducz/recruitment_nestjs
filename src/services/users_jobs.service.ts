import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ROLES } from 'src/common/utils/enums';
import { CreateUsersJobDto } from 'src/dto/users_jobs/create-users_job.dto';
import { UpdateUsersJobDto } from 'src/dto/users_jobs/update-users_job.dto';
import { UsersJob } from 'src/entities/users_job.entity';
import { UsersJobRepository } from 'src/modules/users_jobs/users_jobs.repository';
import { ApplicationStatusService } from './application_status.service';
import { CurriculumVitaesService } from './curriculum_vitaes.service';
import { RolesService } from './roles.service';
import { UsersService } from './users.service';

@Injectable()
export class UsersJobsService {
  constructor(
    @Inject(UsersJobRepository)
    private readonly usersJobRepository: UsersJobRepository,
    @Inject(CurriculumVitaesService)
    private readonly curriculumVitaesService: CurriculumVitaesService,
    @Inject(ApplicationStatusService)
    private readonly applicationStatusService: ApplicationStatusService,
    @Inject(RolesService)
    private readonly roleService: RolesService,
    @Inject(UsersService)
    private readonly userService: UsersService,
  ) {}

  async aplly(createUsersJobDto: ICreate<CreateUsersJobDto>) {
    const { variable } = createUsersJobDto;
    const cv = await this.curriculumVitaesService.findById(
      variable.curriculumVitaesId,
    );

    if (!cv) throw new BadRequestException('Hãy cung cấp CV để ứng tuyển!');

    return await this.usersJobRepository.create({
      ...createUsersJobDto,
      variable: { ...variable, curriculumVitae: cv },
    });
  }

  async isApplied(params: { jobsId: number; usersId: number }) {
    return await this.usersJobRepository.isExist(params);
  }

  async findAppliedJobsOfUser(appliedJobQueries: IAppliedJobQueries) {
    return await this.usersJobRepository.findAppliedJobsByUserId(
      appliedJobQueries,
    );
  }

  async findApplicantsForJob(findApplicantsForJob: IFindApplicantsQueries) {
    return await this.usersJobRepository.findApplicantsForJob(
      findApplicantsForJob,
    );
  }

  findAll() {
    return `This action returns all usersJobs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usersJob`;
  }

  async update(updateUsersJobDto: IUpdate<UpdateUsersJobDto>) {
    const { updateBy, variable } = updateUsersJobDto;

    const currentUser = await this.userService.findById(updateBy, {
      hasRelations: false,
    });
    if (!currentUser) throw new NotFoundException('Không tìm thấy người dùng!');

    const role = await this.roleService.findById(currentUser.role.id);
    if (!role) throw new NotFoundException('Không tìm thấy chức vụ!');

    const nowDate = new Date().toString();

    return await this.usersJobRepository.update({
      ...updateUsersJobDto,
      variable: {
        ...((role.title.toLowerCase() === ROLES.USER
          ? {
              updateAt: nowDate,
              updateBy,
              // update CV
            }
          : {
              employerUpdateAt: nowDate,
              employerUpdateBy: updateBy,
              applicationStatus: await this.applicationStatusService.findById(
                variable.statusId,
              ),
            }) as Partial<UsersJob>),
      },
      queries: { jobsId: variable.jobsId, usersId: variable.usersId },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} usersJob`;
  }
}
