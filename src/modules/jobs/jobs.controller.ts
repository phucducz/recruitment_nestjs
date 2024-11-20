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

import { STATUS_TITLES, STATUS_TYPE_TITLES } from 'src/common/utils/enums';
import { rtPageInfoAndItems } from 'src/common/utils/function';
import { CreateJobDto } from 'src/dto/jobs/create-job.dto';
import { UpdateJobDto } from 'src/dto/jobs/update-job.dto';
import { StatusService } from 'src/services/status.service';
import { StatusTypesService } from 'src/services/status_types.service';
import { JobsService } from '../../services/jobs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly statusService: StatusService,
    private readonly statusTypesService: StatusTypesService,
  ) {}

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

  @UseGuards(JwtAuthGuard)
  @Get('/employer/all')
  async findAllJobForEmployer(
    @Query() jobQueries: IFIndJobsForEmployerQueries,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      const result = await this.jobsService.findAllForEmployer({
        ...jobQueries,
        usersId: request.user.userId,
      });

      return res.status(200).json({
        statusCode: 200,
        ...rtPageInfoAndItems(
          {
            page: jobQueries.page,
            pageSize: jobQueries.pageSize,
          },
          result,
        ),
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: `Lấy danh sách công việc thất bại. ${error?.message ?? error}!`,
      });
    }
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

      if (!result)
        return res.status(401).json({
          message: 'Cập nhật công việc không thành công!',
          statusCode: 401,
        });

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

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      const result = await this.jobsService.remove({
        deleteBy: request.user.userId,
        variable: { id: +id },
      });

      if (!result)
        return res.status(401).json({
          message: 'Xóa công việc không thành công!',
          statusCode: 401,
        });

      return res
        .status(200)
        .json({ message: 'Xóa công việc thành công!', statusCode: 200 });
    } catch (error) {
      return res.status(500).json({
        message: `Xóa công việc không thành công. ${error?.message ?? error}!`,
        statusCode: 500,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/restore/:id')
  async restore(
    @Param('id') id: string,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      const statusType = await this.statusTypesService.findByTitle(
        STATUS_TYPE_TITLES.JOB,
      );
      const status = await this.statusService.findByTitle(
        STATUS_TITLES.JOB_ACTIVE,
        statusType.id,
      );
      const result = await this.jobsService.update(+id, {
        updateBy: request.user.userId,
        variable: {
          statusId: status.id,
          deleteAt: null,
          deleteBy: null,
        },
      });

      if (!result)
        return res.status(401).json({
          message: 'Khôi phục công việc không thành công!',
          statusCode: 401,
        });

      return res
        .status(200)
        .json({ message: 'Khôi phục công việc thành công!', statusCode: 200 });
    } catch (error) {
      return res.status(500).json({
        message: `Khôi phục việc không thành công. ${error?.message ?? error}!`,
        statusCode: 500,
      });
    }
  }
}
