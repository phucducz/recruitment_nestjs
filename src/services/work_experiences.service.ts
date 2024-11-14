import { Inject, Injectable } from '@nestjs/common';

import { CreateWorkExperienceDto } from 'src/dto/work_experiences/create-work_experience.dto';
import { UpdateWorkExperienceDto } from 'src/dto/work_experiences/update-work_experience.dto';
import { WorkExperiencesRepository } from 'src/modules/work_experiences/work_experiences.repository';
import { JobCategoriesService } from './job_categories.service';
import { JobPositionsService } from './job_positions.service';
import { PlacementsService } from './placements.service';
import { UsersService } from './users.service';

@Injectable()
export class WorkExperiencesService {
  constructor(
    @Inject(WorkExperiencesRepository)
    private readonly workExperiencesRepository: WorkExperiencesRepository,
    @Inject(JobCategoriesService)
    private readonly jobCategoryService: JobCategoriesService,
    @Inject(JobPositionsService)
    private readonly jobPositionService: JobPositionsService,
    @Inject(PlacementsService)
    private readonly placementService: PlacementsService,
    @Inject(UsersService) private readonly userService: UsersService,
  ) {}

  async create(createWorkExperienceDto: ICreate<CreateWorkExperienceDto>) {
    const { variable, createBy } = createWorkExperienceDto;

    return await this.workExperiencesRepository.create({
      ...createWorkExperienceDto,
      variable: {
        ...variable,
        jobCategory: await this.jobCategoryService.findById(
          variable.jobCategoriesId,
        ),
        jobPosition: await this.jobPositionService.findById(
          variable.positionId,
        ),
        placement: await this.placementService.findById(variable.placementsId),
        user: await this.userService.findById(createBy),
      },
    });
  }

  findAll() {
    return `This action returns all workExperiences`;
  }

  async findBy(workExperienceQueries: IFindWorkExperiencesQueries) {
    return await this.workExperiencesRepository.findBy(workExperienceQueries);
  }

  async update(
    id: number,
    updateWorkExperienceDto: IUpdate<UpdateWorkExperienceDto>,
  ) {
    const { variable } = updateWorkExperienceDto;

    return await this.workExperiencesRepository.update(id, {
      ...updateWorkExperienceDto,
      variable: {
        ...variable,
        jobCategory: await this.jobCategoryService.findById(
          variable.jobCategoriesId,
        ),
        jobPosition: await this.jobPositionService.findById(
          variable.positionId,
        ),
        placement: await this.placementService.findById(variable.placementsId),
      },
    });
  }

  async remove(id: number) {
    return await this.workExperiencesRepository.remove(id);
  }
}
