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
import { CreateAchivementDto } from 'src/dto/achivements/create-achivement.dto';
import { UpdateAchivementDto } from 'src/dto/achivements/update-achivement.dto';
import { AchivementsService } from '../../services/achivements.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('achivements')
export class AchivementsController {
  constructor(private readonly achivementsService: AchivementsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createAchivementDto: CreateAchivementDto,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      const result = await this.achivementsService.create({
        createBy: request.user.userId,
        variable: createAchivementDto,
      });

      if (!result?.id)
        return res.status(401).json({
          message: 'Thêm thành tích không thành công!',
          statusCode: 401,
        });

      return res.status(200).json({
        message: 'Thêm thành tích thành công!',
        statusCode: 200,
        ...result,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error,
        statusCode: 500,
      });
    }
  }

  @Get()
  findAll() {
    return this.achivementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.achivementsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAchivementDto: UpdateAchivementDto,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      const result = await this.achivementsService.update(+id, {
        updateBy: request.user.userId,
        variable: updateAchivementDto,
      });

      if (!result)
        return res.status(401).json({
          message: 'Cập nhật thành tích không thành công!',
          statusCode: 401,
        });

      return res.status(200).json({
        message: 'Cập nhật thành tích thành công!',
        statusCode: 200,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error, statusCode: 500 });
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.achivementsService.remove(+id);
  }
}
