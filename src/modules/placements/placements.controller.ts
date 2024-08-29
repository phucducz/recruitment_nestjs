import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreatePlacementDto } from 'src/dto/placements/create-placement.dto';
import { UpdatePlacementDto } from 'src/dto/placements/update-placement.dto';
import { PlacementsService } from '../../services/placements.service';

@Controller('placements')
export class PlacementsController {
  constructor(private readonly placementsService: PlacementsService) {}

  @Post()
  create(@Body() createPlacementDto: CreatePlacementDto) {
    return this.placementsService.create(createPlacementDto);
  }

  @Get()
  findAll() {
    return this.placementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.placementsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlacementDto: UpdatePlacementDto,
  ) {
    return this.placementsService.update(+id, updatePlacementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.placementsService.remove(+id);
  }
}
