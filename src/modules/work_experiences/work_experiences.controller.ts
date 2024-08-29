import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateWorkExperienceDto } from 'src/dto/work_experiences/create-work_experience.dto';
import { UpdateWorkExperienceDto } from 'src/dto/work_experiences/update-work_experience.dto';
import { WorkExperiencesService } from '../../services/work_experiences.service';

@Controller('work-experiences')
export class WorkExperiencesController {
  constructor(
    private readonly workExperiencesService: WorkExperiencesService,
  ) {}

  @Post()
  create(@Body() createWorkExperienceDto: CreateWorkExperienceDto) {
    return this.workExperiencesService.create(createWorkExperienceDto);
  }

  @Get()
  findAll() {
    return this.workExperiencesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workExperiencesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWorkExperienceDto: UpdateWorkExperienceDto,
  ) {
    return this.workExperiencesService.update(+id, updateWorkExperienceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workExperiencesService.remove(+id);
  }
}
