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

import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSION } from 'src/common/utils/enums';
import { rtPageInfoAndItems } from 'src/common/utils/function';
import { CreateWorkExperienceDto } from 'src/dto/work_experiences/create-work_experience.dto';
import { UpdateWorkExperienceDto } from 'src/dto/work_experiences/update-work_experience.dto';
import { WorkExperiencesService } from '../../services/work_experiences.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionGuard } from '../auth/permission.guard';

@Controller('work-experiences')
export class WorkExperiencesController {
  constructor(
    private readonly workExperiencesService: WorkExperiencesService,
  ) {}

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PERMISSION.EDIT_PROFILE)
  @Post()
  async create(
    @Body() createWorkExperienceDto: CreateWorkExperienceDto,
    @Request() request: any,
    @Res() res: Response,
  ) {
    try {
      const result = await this.workExperiencesService.create({
        variable: createWorkExperienceDto,
        createBy: request.user.userId,
      });

      if (!result?.id)
        return res.status(401).json({
          message: 'Thêm kinh nghiệm làm việc không thành công!',
          statusCode: 401,
        });

      return res.status(200).json({
        message: 'Thêm kinh nghiệm làm việc thành công!',
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
  async findOne(
    @Query() workExperienceQueries: IFindWorkExperiencesQueries,
    @Res() res: Response,
  ) {
    try {
      const result = await this.workExperiencesService.findBy(
        workExperienceQueries,
      );

      return res.status(200).json({
        statusCode: 200,
        ...rtPageInfoAndItems(
          {
            page: +workExperienceQueries.page,
            pageSize: +workExperienceQueries.pageSize,
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

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PERMISSION.EDIT_PROFILE)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWorkExperienceDto: UpdateWorkExperienceDto,
    @Request() request: any,
    @Res() res: Response,
  ) {
    try {
      const result = await this.workExperiencesService.update(+id, {
        updateBy: request.user.userId,
        variable: updateWorkExperienceDto,
      });

      if (!result)
        return res.status(401).json({
          message: 'Cập nhật kinh nghiệm làm việc không thành công',
          statusCode: 401,
        });

      return res.status(200).json({
        message: 'Cập nhật kinh nghiệm làm việc thành công',
        statusCode: 200,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error,
        statusCode: 500,
      });
    }
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PERMISSION.EDIT_PROFILE)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.workExperiencesService.remove(+id);

      if (!result)
        return res.status(401).json({
          message: 'Xóa kinh nghiệm làm việc không thành công',
          statusCode: 401,
        });

      return res.status(200).json({
        message: 'Xóa kinh nghiệm làm việc thành công',
        statusCode: 200,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error,
        statusCode: 500,
      });
    }
  }
}
