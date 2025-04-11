import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { rtPageInfoAndItems } from 'src/common/utils/function';
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

  @Get('/all')
  async findAll(
    @Query() desiredJobsQueries: IFindDesiredJobsQueries,
    @Res() res: Response,
  ) {
    try {
      const result = await this.desiredJobsService.findAll(desiredJobsQueries);

      return res.status(200).json({
        statusCode: 200,
        ...rtPageInfoAndItems(
          {
            page: +desiredJobsQueries.page,
            pageSize: +desiredJobsQueries.pageSize,
          },
          result,
        ),
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message ?? error, statusCode: 500 });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findOne(@Request() request: any, @Res() res: Response) {
    try {
      const result = await this.desiredJobsService.findOneBy({
        where: { user: { id: request.user.userId } },
      });

      return res.status(200).json({
        statusCode: 200,
        ...result,
      });
    } catch (error) {
      return res.status(500).json({
        message: `Lấy thông tin công việc mong muốn thất bại. ${error?.message ?? error}!`,
        statusCode: 500,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDesiredJobDto: UpdateDesiredJobDto,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      const result = await this.desiredJobsService.update(+id, {
        updateBy: request.user.userId,
        variable: updateDesiredJobDto,
      });

      if (!result)
        return res.status(401).json({
          message: 'Cập nhật công việc mong muốn không thành công!',
          statusCode: 401,
        });

      return res.status(200).json({
        message: 'Cập nhật công việc mong muốn thành công!',
        statusCode: 200,
      });
    } catch (error) {
      return res.status(500).json({
        message: `Cập nhật công việc mong muốn không thành công: ${error?.message ?? error}!`,
        statusCode: 500,
      });
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.desiredJobsService.remove(+id);
  }
}
