import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UpdateJobRecommendationDto } from 'src/dto/job_recomendations/update-job_recomendation.dto';

import { JobRecommendationsService } from 'src/services/job_recomendations.service';

@Controller('job-recommendations')
export class JobRecomendationsController {
  constructor(
    private readonly jobRecomendationsService: JobRecommendationsService,
  ) {}

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
    @Body() updateJobRecomendationDto: UpdateJobRecommendationDto,
  ) {
    return this.jobRecomendationsService.update(+id, updateJobRecomendationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobRecomendationsService.remove(+id);
  }
}
