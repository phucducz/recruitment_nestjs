import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateWorkExperienceDto } from 'src/dto/work_experiences/create-work_experience.dto';
import { WorkExperience } from 'src/entities/work_experience.entity';
import { JobCategoriesService } from 'src/services/job_categories.service';
import { JobPositionsService } from 'src/services/job_positions.service';
import { PlacementsService } from 'src/services/placements.service';
import { UsersService } from 'src/services/users.service';

@Injectable()
export class WorkExperiencesRepository {
  constructor(
    @InjectRepository(WorkExperience)
    private readonly workExperienceRepository: Repository<WorkExperience>,
    @Inject(JobCategoriesService)
    private readonly jobCategoryService: JobCategoriesService,
    @Inject(JobPositionsService)
    private readonly jobPositionService: JobPositionsService,
    @Inject(PlacementsService)
    private readonly placementService: PlacementsService,
    @Inject(UsersService)
    private readonly userService: UsersService,
  ) {}

  async create(createWorkExperienceDto: ICreate<CreateWorkExperienceDto>) {
    const { createBy, variable } = createWorkExperienceDto;

    return (await this.workExperienceRepository.save({
      companyName: variable.companyName,
      createAt: new Date().toString(),
      createBy,
      description: variable.description,
      endDate: variable.endDate,
      isWorking: typeof variable.endDate === null,
      startDate: variable.startDate,
      jobCategory: await this.jobCategoryService.findById(
        variable.jobCategoriesId,
      ),
      jobPosition: await this.jobPositionService.findById(variable.positionId),
      placement: await this.placementService.findById(variable.placementsId),
      user: await this.userService.findById(createBy),
    })) as WorkExperience;
  }

  async remove(id: number) {
    const result = await this.workExperienceRepository.delete(id);

    return result.affected > 0;
  }
}
