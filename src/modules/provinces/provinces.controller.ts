import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateProvinceDto } from 'src/dto/provinces/create-province.dto';
import { UpdateProvinceDto } from 'src/dto/provinces/update-province.dto';
import { ProvincesService } from '../../services/provinces.service';

@Controller('provinces')
export class ProvincesController {
  constructor(private readonly provincesService: ProvincesService) {}

  @Post()
  create(@Body() createProvinceDto: CreateProvinceDto) {
    return this.provincesService.create(createProvinceDto);
  }

  @Get()
  findAll() {
    return this.provincesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.provincesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProvinceDto: UpdateProvinceDto,
  ) {
    return this.provincesService.update(+id, updateProvinceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.provincesService.remove(+id);
  }
}
