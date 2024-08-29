import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JobsPlacementsService } from './jobs_placements.service';
import { CreateJobsPlacementDto } from './dto/create-jobs_placement.dto';
import { UpdateJobsPlacementDto } from './dto/update-jobs_placement.dto';

@Controller('jobs-placements')
export class JobsPlacementsController {
  constructor(private readonly jobsPlacementsService: JobsPlacementsService) {}

  @Post()
  create(@Body() createJobsPlacementDto: CreateJobsPlacementDto) {
    return this.jobsPlacementsService.create(createJobsPlacementDto);
  }

  @Get()
  findAll() {
    return this.jobsPlacementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsPlacementsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobsPlacementDto: UpdateJobsPlacementDto) {
    return this.jobsPlacementsService.update(+id, updateJobsPlacementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobsPlacementsService.remove(+id);
  }
}
