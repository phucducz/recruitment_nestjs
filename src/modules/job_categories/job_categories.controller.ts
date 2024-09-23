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
import { CreateJobCategoryDto } from 'src/dto/job_categories/create-job_category.dto';
import { PaginationDto } from 'src/dto/pagination/pagination.dto';
import { JobCategoriesService } from '../../services/job_categories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('job-categories')
export class JobCategoriesController {
  constructor(private readonly jobCategoriesService: JobCategoriesService) {}

  @Get('/all')
  async findAll(@Body() pagination: PaginationDto, @Res() res: Response) {
    const result = await this.jobCategoriesService.findAll(pagination);

    return res.status(200).json({ ...rtPageInfoAndItems(pagination, result) });
  }

  @Get('?')
  async findById(@Query('id') id: number) {
    return await this.jobCategoriesService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createJobCategoryDto: CreateJobCategoryDto,
    @Request() request: any,
    @Res() res: Response,
  ) {
    try {
      const result = await this.jobCategoriesService.create({
        variable: createJobCategoryDto,
        createBy: request.user.userId,
      });

      if (result)
        return res.status(200).json({
          statusCode: 200,
          message: 'Tạo thành công!',
          record: result,
        });

      return res.status(401).json({
        statusCode: 401,
        message: 'Tạo không thành công!',
        record: null,
      });
    } catch (error) {
      return res.status(500).json({ stautsCode: 500, message: error });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/many')
  async createMany(
    @Body() createManyJobCategoryDto: CreateJobCategoryDto[],
    @Request() request: any,
    @Res() res: Response,
  ) {
    try {
      const result = await this.jobCategoriesService.createMany({
        variables: createManyJobCategoryDto,
        createBy: request.user.userId,
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
}
