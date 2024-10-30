import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateDesiredJobsPlacementDto } from 'src/dto/desired_jobs_placements/create-desired_jobs_placement.dto';
import { UpdateDesiredJobsPlacementDto } from 'src/dto/desired_jobs_placements/update-desired_jobs_placement.dto';
import { DesiredJobsPlacementsService } from 'src/services/desired_jobs_placements.service';

@Controller('desired-jobs-placements')
export class DesiredJobsPlacementsController {
  constructor(
    private readonly desiredJobsPlacementsService: DesiredJobsPlacementsService,
  ) {}

  @Post()
  create(@Body() createDesiredJobsPlacementDto: CreateDesiredJobsPlacementDto) {
    return this.desiredJobsPlacementsService.create(
      createDesiredJobsPlacementDto,
    );
  }

  @Get()
  findAll() {
    return this.desiredJobsPlacementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.desiredJobsPlacementsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDesiredJobsPlacementDto: UpdateDesiredJobsPlacementDto,
  ) {
    return this.desiredJobsPlacementsService.update(
      +id,
      updateDesiredJobsPlacementDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.desiredJobsPlacementsService.remove(+id);
  }
}
