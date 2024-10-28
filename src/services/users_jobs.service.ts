import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { CreateUsersJobDto } from 'src/dto/users_jobs/create-users_job.dto';
import { UpdateUsersJobDto } from 'src/dto/users_jobs/update-users_job.dto';
import { UsersJobRepository } from 'src/modules/users_jobs/users_jobs.repository';
import { CurriculumVitaesService } from './curriculum_vitaes.service';

@Injectable()
export class UsersJobsService {
  constructor(
    @Inject(UsersJobRepository)
    private readonly usersJobRepository: UsersJobRepository,
    @Inject(CurriculumVitaesService)
    private readonly curriculumVitaesService: CurriculumVitaesService,
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

  update(id: number, updateUsersJobDto: UpdateUsersJobDto) {
    return `This action updates a #${id} usersJob`;
  }

  remove(id: number) {
    return `This action removes a #${id} usersJob`;
  }
}
