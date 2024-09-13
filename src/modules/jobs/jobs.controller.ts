import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { JobsService } from '../../services/jobs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  // @Post()
  // create(@Body() createJobDto: CreateJobDto) {
  //   return this.jobsService.create(createJobDto);
  // }

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  async findAll() {
    return await this.jobsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('?')
  async findOne(@Query('id') id: string) {
    return await this.jobsService.findById(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
  //   return this.jobsService.update(+id, updateJobDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.jobsService.remove(+id);
  // }
}
