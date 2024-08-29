import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateWorkTypeDto } from 'src/dto/work_types/create-work_type.dto';
import { UpdateWorkTypeDto } from 'src/dto/work_types/update-work_type.dto';
import { WorkTypesService } from '../../services/work_types.service';

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
  update(
    @Param('id') id: string,
    @Body() updateWorkTypeDto: UpdateWorkTypeDto,
  ) {
    return this.workTypesService.update(+id, updateWorkTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workTypesService.remove(+id);
  }
}
