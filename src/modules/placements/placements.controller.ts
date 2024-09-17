import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { CreatePlacementDto } from 'src/dto/placements/create-placement.dto';
import { PlacementsService } from '../../services/placements.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaginationDto } from 'src/dto/pagination/pagination.dto';

@Controller('placements')
export class PlacementsController {
  constructor(private readonly placementsService: PlacementsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createMany(
    @Body() createManyPlacementDto: CreatePlacementDto[],
    @Request() request: any,
    @Res() res: Response,
  ) {
    try {
      const result = await this.placementsService.createMany({
        createBy: request.user.userId,
        variables: createManyPlacementDto,
      });

      if (result.length > 0)
        return res
          .status(200)
          .json({ message: 'Tạo thành công!', records: result });

      return res
        .status(401)
        .json({ message: 'Tạo không thành công!', records: [] });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  @Get('/all')
  findAll(@Body() pagination: PaginationDto) {
    return this.placementsService.findAll(pagination);
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
