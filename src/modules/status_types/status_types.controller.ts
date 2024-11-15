import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StatusTypesService } from '../services/status_types.service';
import { CreateStatusTypeDto } from './dto/create-status_type.dto';
import { UpdateStatusTypeDto } from './dto/update-status_type.dto';

@Controller('status-types')
export class StatusTypesController {
  constructor(private readonly statusTypesService: StatusTypesService) {}

  @Post()
  create(@Body() createStatusTypeDto: CreateStatusTypeDto) {
    return this.statusTypesService.create(createStatusTypeDto);
  }

  @Get()
  findAll() {
    return this.statusTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statusTypesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStatusTypeDto: UpdateStatusTypeDto) {
    return this.statusTypesService.update(+id, updateStatusTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.statusTypesService.remove(+id);
  }
}
