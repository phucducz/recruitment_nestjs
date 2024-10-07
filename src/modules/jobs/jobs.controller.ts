import {
  Body,
  Controller,
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
import { CreateJobDto } from 'src/dto/jobs/create-job.dto';
import { UpdateJobDto } from 'src/dto/jobs/update-job.dto';
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
        return res.status(200).json({
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

  @Get('/all?')
  async findAll(@Query() jobQueries: IJobQueries, @Res() res: Response) {
    const result = await this.jobsService.findAll(jobQueries);

    return res.status(200).json({
      ...rtPageInfoAndItems(
        {
          page: +jobQueries.page,
          pageSize: +jobQueries.pageSize,
        },
        result,
      ),
    });
  }

  @Get('?')
  async findOne(@Query('id') id: string) {
    return await this.jobsService.findById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateJob(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      const result = await this.jobsService.update(+id, {
        variable: updateJobDto,
        updateBy: request.user.userId,
      });

      if (!result.isSuccess)
        return res
          .status(401)
          .json({ message: 'Cập nhật công việc thành công!', statusCode: 401 });

      return res
        .status(200)
        .json({ message: 'Cập nhật công việc thành công!', statusCode: 200 });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message ?? error, statusCode: 500 });
    }
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
