import {
  Body,
  Controller,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { CreateJobCategoryDto } from 'src/dto/job_categories/create-job_category.dto';
import { JobCategoriesService } from '../../services/job_categories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('job-categories')
export class JobCategoriesController {
  constructor(private readonly jobCategoriesService: JobCategoriesService) {}

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
        return res.status(200).json({ message: 'Tạo thành công!', ...result });

      return res
        .status(401)
        .json({ message: 'Tạo không thành công!', ...result });
    } catch (error) {
      return res.status(500).json({ message: error });
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
        return res
          .status(200)
          .json({ message: 'Tạo thành công!', records: result });

      return res
        .status(401)
        .json({ message: 'Tạo không thành công!', records: result });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
