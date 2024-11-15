import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  APPLICANT_SOURCES,
  ROLES,
  STATUS_TITLES,
  STATUS_TYPE_TITLES,
} from 'src/common/utils/enums';
import { CreateUsersJobDto } from 'src/dto/users_jobs/create-users_job.dto';
import { UpdateUsersJobDto } from 'src/dto/users_jobs/update-users_job.dto';
import { UsersJob } from 'src/entities/users_job.entity';
import { UsersJobRepository } from 'src/modules/users_jobs/users_jobs.repository';
import { CurriculumVitaesService } from './curriculum_vitaes.service';
import { RolesService } from './roles.service';
import { StatusService } from './status.service';
import { StatusTypesService } from './status_types.service';
import { UsersService } from './users.service';

@Injectable()
export class UsersJobsService {
  constructor(
    @Inject(UsersJobRepository)
    private readonly usersJobRepository: UsersJobRepository,
    @Inject(CurriculumVitaesService)
    private readonly curriculumVitaesService: CurriculumVitaesService,
    @Inject(RolesService)
    private readonly roleService: RolesService,
    @Inject(UsersService)
    private readonly userService: UsersService,
    @Inject(StatusService)
    private readonly statusService: StatusService,
    @Inject(StatusTypesService)
    private readonly statusTypesService: StatusTypesService,
  ) {}

  async aplly(createUsersJobDto: ICreate<CreateUsersJobDto>) {
    const { variable } = createUsersJobDto;
    const cv = await this.curriculumVitaesService.findById(
      +variable.curriculumVitaesId,
    );
    const statusType = await this.statusTypesService.findByTitle(
      STATUS_TYPE_TITLES.INTERVIEW,
    );
    const status = await this.statusService.findByTitle(
      STATUS_TITLES.APPLICATION_EVALUATING,
      statusType.id,
    );

    if (!cv) throw new BadRequestException('Hãy cung cấp CV để ứng tuyển!');

    return await this.usersJobRepository.create({
      ...createUsersJobDto,
      variable: {
        ...variable,
        curriculumVitae: cv,
        status,
      },
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
    if (
      findApplicantsForJob.source &&
      !Object.values(APPLICANT_SOURCES).includes(
        findApplicantsForJob.source as APPLICANT_SOURCES,
      )
    )
      throw new Error(
        `Nguồn không hợp lệ. Giá trị phải là một trong "${Object.values(APPLICANT_SOURCES).join(', ')}"`,
      );

    return await this.usersJobRepository.findApplicantsForJob(
      findApplicantsForJob,
    );
  }

  async findApplicantDetail(
    findApplicantDetailQueries: IFindApplicantDetailQueries,
  ) {
    if (
      !findApplicantDetailQueries.usersId ||
      !findApplicantDetailQueries.jobsId
    )
      throw new Error('jobsId và usersId là bắt buộc!');

    return await this.usersJobRepository.findApplicantDetail(
      findApplicantDetailQueries,
    );
  }

  findAll() {
    return `This action returns all usersJobs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usersJob`;
  }

  async findByCompositePrKey(params: { usersId: number; jobsId: number }) {
    return await this.usersJobRepository.findByCompositePrKey(params);
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
              status: await this.statusService.findById(variable.statusId),
            }) as Partial<UsersJob>),
      },
      queries: { jobsId: variable.jobsId, usersId: variable.usersId },
    });
  }

  async getMonthlyCandidateStatisticsByYear(year: string) {
    return await this.usersJobRepository.getMonthlyCandidateStatisticsByYear(
      year,
    );
  }

  remove(id: number) {
    return `This action removes a #${id} usersJob`;
  }
}
