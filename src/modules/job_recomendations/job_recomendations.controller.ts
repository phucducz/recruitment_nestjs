import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateJobRecomendationDto } from 'src/dto/job_recomendations/create-job_recomendation.dto';
import { UpdateJobRecomendationDto } from 'src/dto/job_recomendations/update-job_recomendation.dto';
import { JobRecomendationsService } from 'src/services/job_recomendations.service';

@Controller('job-recomendations')
export class JobRecomendationsController {
  constructor(
    private readonly jobRecomendationsService: JobRecomendationsService,
  ) {}

  @Post()
  create(@Body() createJobRecomendationDto: CreateJobRecomendationDto) {
    return this.jobRecomendationsService.create(createJobRecomendationDto);
  }

  @Get()
  findAll() {
    return this.jobRecomendationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobRecomendationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateJobRecomendationDto: UpdateJobRecomendationDto,
  ) {
    return this.jobRecomendationsService.update(+id, updateJobRecomendationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobRecomendationsService.remove(+id);
  }
}
