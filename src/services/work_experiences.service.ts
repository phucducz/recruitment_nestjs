import { Injectable } from '@nestjs/common';

import { CreateWorkExperienceDto } from 'src/dto/work_experiences/create-work_experience.dto';
import { UpdateWorkExperienceDto } from 'src/dto/work_experiences/update-work_experience.dto';

@Injectable()
export class WorkExperiencesService {
  create(createWorkExperienceDto: CreateWorkExperienceDto) {
    return 'This action adds a new workExperience';
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
