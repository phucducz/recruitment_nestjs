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
import { CreateScheduleDto } from 'src/dto/schedules/create-schedule.dto';
import { UpdateScheduleDto } from 'src/dto/schedules/update-schedule.dto';
import { SchedulesService } from '../../services/schedules.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createScheduleDto: CreateScheduleDto,
    @Request() request: any,
    @Res() res: Response,
  ) {
    try {
      const result = await this.schedulesService.create({
        createBy: request.user.userId,
        variable: createScheduleDto,
      });

      if (!result)
        return res.status(401).json({
          statusCode: 401,
          message: 'Thêm lịch phỏng vấn không thành công!',
        });

      return res.status(200).json({
        statusCode: 200,
        message: 'Thêm lịch phỏng vấn thành công!',
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: `Thêm lịch phỏng vấn không thành công. ${error?.message ?? error}!`,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
    @Request() request: any,
    @Res() res: Response,
  ) {
    try {
      const result = await this.schedulesService.update(+id, {
        updateBy: request.user.userId,
        variable: updateScheduleDto,
      });

      if (!result)
        return res.status(401).json({
          statusCode: 401,
          message: 'Chỉnh sửa lịch phỏng vấn không thành công!',
        });

      return res.status(200).json({
        statusCode: 200,
        message: 'Chỉnh sửa lịch phỏng vấn thành công!',
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: `Chỉnh sửa lịch phỏng vấn không thành công. ${error?.message ?? error}!`,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.schedulesService.remove(+id);

      if (!result)
        return res.status(401).json({
          statusCode: 401,
          message: 'Xóa lịch phỏng vấn không thành công!',
        });

      return res.status(200).json({
        statusCode: 200,
        message: 'Xóa lịch phỏng vấn thành công!',
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: `Xóa lịch phỏng vấn không thành công. ${error?.message ?? error}!`,
      });
    }
  }

  @Get()
  findAll() {
    return this.schedulesService.findAll();
  }

  @Get('interview')
  async findInterviewSchedules(
    @Query() findInterviewSchedules: IFindInterviewSchedules,
    @Res() res: Response,
  ) {
    try {
      const result = await this.schedulesService.findInterviewSchedules(
        findInterviewSchedules,
      );

      return res.status(200).json({
        statusCode: 200,
        ...rtPageInfoAndItems(
          {
            page: +findInterviewSchedules.page,
            pageSize: +findInterviewSchedules.pageSize,
          },
          result,
        ),
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: `Lấy danh sách lịch phỏng vấn không thành công. ${error?.message ?? error}!`,
      });
    }
  }
}
