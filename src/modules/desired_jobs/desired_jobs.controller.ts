import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { rtPageInfoAndItems } from 'src/common/utils/function';
import { CreateDesiredJobDto } from 'src/dto/desired_jobs/create-desired_job.dto';
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.desiredJobsService.findOne(+id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateDesiredJobDto: UpdateDesiredJobDto,
  // ) {
  //   return this.desiredJobsService.update(+id, updateDesiredJobDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.desiredJobsService.remove(+id);
  }
}
