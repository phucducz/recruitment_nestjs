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

  @Get()
  findAll() {
    return this.schedulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.schedulesService.update(+id, updateScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schedulesService.remove(+id);
  }
}
