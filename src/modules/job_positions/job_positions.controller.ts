import { Controller, Get, Query } from '@nestjs/common';
import { JobPositionsService } from 'src/services/job_positions.service';

@Controller('job-positions')
export class JobPositionsController {
  constructor(private readonly jobPositionsService: JobPositionsService) {}

  // @Post()
  // create(@Body() createJobPositionDto: CreateJobPositionDto) {
  //   return this.jobPositionsService.create(createJobPositionDto);
  // }

  @Get('?')
  findById(@Query('id') id: number) {
    return this.jobPositionsService.findById(id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.jobPositionsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateJobPositionDto: UpdateJobPositionDto,
  // ) {
  //   return this.jobPositionsService.update(+id, updateJobPositionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.jobPositionsService.remove(+id);
  // }
}
