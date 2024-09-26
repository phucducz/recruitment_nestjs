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

import { rtPageInfoAndItems } from 'src/common/utils/function';
import { CreatePlacementDto } from 'src/dto/placements/create-placement.dto';
import { PlacementsService } from '../../services/placements.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
        return res.status(200).json({
          statusCode: 200,
          message: 'Tạo thành công!',
          records: result,
        });

      return res.status(401).json({
        statusCode: 401,
        message: 'Tạo không thành công!',
        records: [],
      });
    } catch (error) {
      return res.status(500).json({ stautsCode: 500, message: error });
    }
  }

  @Get('/all?')
  async findAll(@Query() pagination: IPaginationQuery, @Res() res: Response) {
    const paginationParams = {
      page: +pagination.page,
      pageSize: +pagination.pageSize,
    };
    const result = await this.placementsService.findAll(paginationParams);

    return res
      .status(200)
      .json({ ...rtPageInfoAndItems(paginationParams, result) });
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
