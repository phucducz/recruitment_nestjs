import { Controller } from '@nestjs/common';

@Controller('job-fields')
export class JobFieldsController {
  constructor() {}

  // @Post()
  // create(@Body() createJobFieldDto: CreateJobFieldDto) {
  //   return this.jobFieldsService.create(createJobFieldDto);
  // }

  // @Get()
  // findAll() {
  //   return this.jobFieldsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.jobFieldsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateJobFieldDto: UpdateJobFieldDto,
  // ) {
  //   return this.jobFieldsService.update(+id, updateJobFieldDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.jobFieldsService.remove(+id);
  // }
}
