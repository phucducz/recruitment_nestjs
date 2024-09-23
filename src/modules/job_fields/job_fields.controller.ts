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
import { CreateJobFieldDto } from 'src/dto/job_fields/create-job_field.dto';
import { PaginationDto } from 'src/dto/pagination/pagination.dto';
import { JobFieldsService } from 'src/services/job_fields.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('job-fields')
export class JobFieldsController {
  constructor(private readonly jobFieldService: JobFieldsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createJobFieldDto: CreateJobFieldDto,
    @Request() request: any,
    @Res() res: Response,
  ) {
    try {
      const result = await this.jobFieldService.create({
        createBy: request.user.userId,
        variable: createJobFieldDto,
      });

      if (result.id)
        return res.status(200).json({
          statusCode: 200,
          message: 'Thêm thành công!',
          record: result,
        });

      return res.status(401).json({
        statusCode: 401,
        message: 'Thêm mới không thành công!',
        record: null,
      });
    } catch (error) {
      return res.status(500).json({ stautsCode: 500, message: error });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/many')
  async createMany(
    @Body() createJobFieldDto: CreateJobFieldDto[],
    @Request() request: any,
    @Res() res: Response,
  ) {
    try {
      const result = await this.jobFieldService.createMany({
        createBy: request.user.userId,
        variables: createJobFieldDto,
      });

      if (result.length > 0)
        return res.status(200).json({
          statusCode: 200,
          message: 'Thêm thành công!',
          records: result,
        });

      return res.status(401).json({
        statusCode: 401,
        message: 'Thêm mới không thành công!',
        records: [],
      });
    } catch (error) {
      return res.status(500).json({ stautsCode: 500, message: error });
    }
  }

  // @Post()
  // create(@Body() createJobFieldDto: CreateJobFieldDto) {
  //   return this.jobFieldsService.create(createJobFieldDto);
  // }

  @Get('/all')
  async findAll(@Body() pagination: PaginationDto, @Res() res: Response) {
    const result = await this.jobFieldService.findAll(pagination);

    return res.status(200).json({ ...rtPageInfoAndItems(pagination, result) });
  }

  @Get('?')
  findById(@Query('id') id: number) {
    return this.jobFieldService.findById(id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.jobFieldsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateJobFieldDto: UpdateJobFieldDto,
  // ) {
  //   return this.jobFieldsService.update(+id, updateJobFieldDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.jobFieldsService.remove(+id);
  // }
}
