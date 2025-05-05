import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSION } from 'src/common/utils/enums';
import { CreateAchivementDto } from 'src/dto/achivements/create-achivement.dto';
import { UpdateAchivementDto } from 'src/dto/achivements/update-achivement.dto';
import { AchivementsService } from '../../services/achivements.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionGuard } from '../auth/permission.guard';

@Controller('achivements')
export class AchivementsController {
  constructor(private readonly achivementsService: AchivementsService) {}

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions([PERMISSION.EDIT_USER_PROFILE])
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

  @Get('/all')
  findAll() {
    return this.achivementsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findOne(@Request() request: any, @Res() res: Response) {
    try {
      const result = await this.achivementsService.findOne(request.user.userId);

      return res.status(200).json({ statusCode: 200, result: result });
    } catch (error) {
      return res.status(500).json({
        message: `Lấy thành tựu thất bại ${error?.message ?? error}`,
        statusCode: 500,
      });
    }
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions([PERMISSION.EDIT_USER_PROFILE])
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

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions([PERMISSION.EDIT_USER_PROFILE])
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      const result = await this.achivementsService.remove(
        +request.user.userId,
        +id,
      );

      if (!result)
        return res.status(401).json({
          statusCode: 401,
          message: 'Xóa thành tựu không thành công!',
        });

      return res.status(200).json({
        statusCode: 200,
        message: 'Xóa thành tựu thành công!',
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      return res.status(500).json({
        statusCode: 500,
        message: `Xóa thành tựu không thành công. ${error?.message ?? error}!`,
      });
    }
  }
}
