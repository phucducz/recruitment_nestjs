import {
  Body,
  Controller,
  Get,
  Param,
  Patch
} from '@nestjs/common';

import { UpdateJobsPlacementDto } from 'src/dto/jobs_placement/update-jobs_placement.dto';
import { JobsPlacementsService } from '../../services/jobs_placements.service';

@Controller('jobs-placements')
export class JobsPlacementsController {
  constructor(private readonly jobsPlacementsService: JobsPlacementsService) {}

  // @Post()
  // create(@Body() createJobsPlacementDto: CreateJobsPlacementDto) {
  //   return this.jobsPlacementsService.create(createJobsPlacementDto);
  // }

  @Get()
  findAll() {
    return this.jobsPlacementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsPlacementsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateJobsPlacementDto: UpdateJobsPlacementDto,
  ) {
    return this.jobsPlacementsService.update(+id, updateJobsPlacementDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.jobsPlacementsService.remove(+id);
  // }
}
