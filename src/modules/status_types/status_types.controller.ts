import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateStatusTypeDto } from 'src/dto/status_types/create-status_type.dto';
import { UpdateStatusTypeDto } from 'src/dto/status_types/update-status_type.dto';
import { StatusTypesService } from 'src/services/status_types.service';

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
  update(
    @Param('id') id: string,
    @Body() updateStatusTypeDto: UpdateStatusTypeDto,
  ) {
    return this.statusTypesService.update(+id, updateStatusTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.statusTypesService.remove(+id);
  }
}
