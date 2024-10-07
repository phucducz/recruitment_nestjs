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
import { PaginationDto } from 'src/dto/pagination/pagination.dto';
import { CreateWorkTypeDto } from 'src/dto/work_types/create-work_type.dto';
import { JobPositionsService } from 'src/services/job_positions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('job-positions')
export class JobPositionsController {
  constructor(private readonly jobPositionsService: JobPositionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createWorkTypeDto: CreateWorkTypeDto,
    @Request() request: any,
    @Res() res: Response,
  ) {
    try {
      const result = await this.jobPositionsService.create({
        variable: createWorkTypeDto,
        createBy: request.user.userId,
      });

      if (result)
        return res
          .status(200)
          .json({ statusCode: 200, message: 'Tạo thành công', record: result });

      return res.status(401).json({
        statusCode: 401,
        message: 'Tạo không thành công',
        record: null,
      });
    } catch (error) {
      console.log(error);

      return res.status(401).json({ statusCode: 401, message: error });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/many')
  async createMany(
    @Body() createManyWorkTypeDto: CreateWorkTypeDto[],
    @Request() request: any,
    @Res() res: Response,
  ) {
    try {
      const result = await this.jobPositionsService.createMany({
        variables: createManyWorkTypeDto,
        createBy: request.user.userId,
      });

      if (result.length > 0)
        return res.status(200).json({
          statusCode: 200,
          message: 'Tạo thành công',
          records: result,
        });

      return res
        .status(401)
        .json({ message: 'Tạo không thành công', records: [] });
    } catch (error) {
      return res.status(401).json({ statusCode: 401, message: error });
    }
  }

  @Get('/all?')
  async findAll(@Query() pagination: IPagination, @Res() res: Response) {
    const paginationParams = {
      page: +pagination.page,
      pageSize: +pagination.pageSize,
    };
    const result = await this.jobPositionsService.findAll(paginationParams);

    return res.status(200).json({ ...rtPageInfoAndItems(paginationParams, result) });
  }

  @Get('?')
  findById(@Query('id') id: number) {
    return this.jobPositionsService.findById(id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.jobPositionsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateJobPositionDto: UpdateJobPositionDto,
  // ) {
  //   return this.jobPositionsService.update(+id, updateJobPositionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.jobPositionsService.remove(+id);
  // }
}
