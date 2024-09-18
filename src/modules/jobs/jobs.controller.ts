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

import { CreateJobDto } from 'src/dto/jobs/create-job.dto';
import { PaginationDto } from 'src/dto/pagination/pagination.dto';
import { JobsService } from '../../services/jobs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createJobDto: CreateJobDto,
    @Request() request: any,
    @Res() res: Response,
  ) {
    try {
      const result = await this.jobsService.create({
        createBy: request.user.userId,
        variable: createJobDto,
      });

      if (result)
        return res
          .status(200)
          .json({
            statusCode: 200,
            message: 'Tạo tin tuyển dụng thành công!',
            record: result,
          });

      return res.status(401).json({
        statusCode: 401,
        message: 'Tạo tin tuyển dụng không thành công!',
        record: null,
      });
    } catch (error) {
      return res.status(500).json({ stautsCode: 500, message: error });
    }
  }

  @Get('/all')
  async findAll(@Body() pagination: PaginationDto) {
    return await this.jobsService.findAll(pagination);
  }

  @Get('?')
  async findOne(@Query('id') id: string) {
    return await this.jobsService.findById(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
  //   return this.jobsService.update(+id, updateJobDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.jobsService.remove(+id);
  // }
}
