import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateDesiredJobsPositionDto } from 'src/dto/desired_jobs_positions/create-desired_jobs_position.dto';
import { UpdateDesiredJobsPositionDto } from 'src/dto/desired_jobs_positions/update-desired_jobs_position.dto';
import { DesiredJobsPositionsService } from 'src/services/desired_jobs_positions.service';

@Controller('desired-jobs-positions')
export class DesiredJobsPositionsController {
  constructor(
    private readonly desiredJobsPositionsService: DesiredJobsPositionsService,
  ) {}

  @Post()
  create(@Body() createDesiredJobsPositionDto: CreateDesiredJobsPositionDto) {
    return this.desiredJobsPositionsService.create(
      createDesiredJobsPositionDto,
    );
  }

  @Get()
  findAll() {
    return this.desiredJobsPositionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.desiredJobsPositionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDesiredJobsPositionDto: UpdateDesiredJobsPositionDto,
  ) {
    return this.desiredJobsPositionsService.update(
      +id,
      updateDesiredJobsPositionDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.desiredJobsPositionsService.remove(+id);
  }
}
