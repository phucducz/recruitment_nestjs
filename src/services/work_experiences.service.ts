import { Inject, Injectable } from '@nestjs/common';

import { CreateWorkExperienceDto } from 'src/dto/work_experiences/create-work_experience.dto';
import { UpdateWorkExperienceDto } from 'src/dto/work_experiences/update-work_experience.dto';
import { WorkExperiencesRepository } from 'src/modules/work_experiences/work_experiences.repository';

@Injectable()
export class WorkExperiencesService {
  constructor(
    @Inject(WorkExperiencesRepository)
    private readonly workExperiencesRepository: WorkExperiencesRepository,
  ) {}

  async create(createWorkExperienceDto: ICreate<CreateWorkExperienceDto>) {
    return await this.workExperiencesRepository.create(createWorkExperienceDto);
  }

  findAll() {
    return `This action returns all workExperiences`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workExperience`;
  }

  update(id: number, updateWorkExperienceDto: UpdateWorkExperienceDto) {
    return `This action updates a #${id} workExperience`;
  }

  remove(id: number) {
    return `This action removes a #${id} workExperience`;
  }
}
