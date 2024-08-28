import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkTypesService } from './work_types.service';
import { CreateWorkTypeDto } from './dto/create-work_type.dto';
import { UpdateWorkTypeDto } from './dto/update-work_type.dto';

@Controller('work-types')
export class WorkTypesController {
  constructor(private readonly workTypesService: WorkTypesService) {}

  @Post()
  create(@Body() createWorkTypeDto: CreateWorkTypeDto) {
    return this.workTypesService.create(createWorkTypeDto);
  }

  @Get()
  findAll() {
    return this.workTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workTypesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkTypeDto: UpdateWorkTypeDto) {
    return this.workTypesService.update(+id, updateWorkTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workTypesService.remove(+id);
  }
}
