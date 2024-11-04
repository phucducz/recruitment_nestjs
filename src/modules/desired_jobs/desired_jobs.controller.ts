import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { CreateDesiredJobDto } from 'src/dto/desired_jobs/create-desired_job.dto';
import { UpdateDesiredJobDto } from 'src/dto/desired_jobs/update-desired_job.dto';
import { DesiredJobsService } from '../../services/desired_jobs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('desired-jobs')
export class DesiredJobsController {
  constructor(private readonly desiredJobsService: DesiredJobsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createDesiredJobDto: CreateDesiredJobDto,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      const desiredJob = await this.desiredJobsService.create({
        createBy: request.user.userId,
        variable: createDesiredJobDto,
      });

      if (!desiredJob.id)
        return res.status(401).json({
          message: 'Tạo công việc mong muốn không thành công!',
          statusCode: 401,
        });

      return res.status(200).json({
        message: 'Tạo công việc mong muốn thành công!',
        record: desiredJob,
        statusCode: 200,
      });
    } catch (error) {
      return res.status(500).json({
        message: `Tạo công việc mong muốn không thành công. ${error?.message ?? error}!`,
        statusCode: 500,
      });
    }
  }

  @Get()
  findAll() {
    return this.desiredJobsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.desiredJobsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDesiredJobDto: UpdateDesiredJobDto,
  ) {
    return this.desiredJobsService.update(+id, updateDesiredJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.desiredJobsService.remove(+id);
  }
}
