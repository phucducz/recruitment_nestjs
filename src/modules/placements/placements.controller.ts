import { Controller, Get, Query } from '@nestjs/common';

import { PlacementsService } from '../../services/placements.service';

@Controller('placements')
export class PlacementsController {
  constructor(private readonly placementsService: PlacementsService) {}

  // @Post()
  // create(@Body() createPlacementDto: CreatePlacementDto) {
  //   return this.placementsService.create(createPlacementDto);
  // }

  @Get('/all')
  findAll() {
    return this.placementsService.findAll();
  }

  @Get('/all')
  findById(@Query('id') id: number) {
    return this.placementsService.findById(id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.placementsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updatePlacementDto: UpdatePlacementDto,
  // ) {
  //   return this.placementsService.update(+id, updatePlacementDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.placementsService.remove(+id);
  // }
}
