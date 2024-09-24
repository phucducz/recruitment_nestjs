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

import { CreateWorkExperienceDto } from 'src/dto/work_experiences/create-work_experience.dto';
import { UpdateWorkExperienceDto } from 'src/dto/work_experiences/update-work_experience.dto';
import { WorkExperiencesService } from '../../services/work_experiences.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('work-experiences')
export class WorkExperiencesController {
  constructor(
    private readonly workExperiencesService: WorkExperiencesService,
  ) {}

  @UseGuards(JwtAuthGuard)
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
          message: 'Thêm kinh nghiệm việc không thành công!',
          statusCode: 401,
        });

      return res.status(200).json({
        message: 'Thêm kinh nghiệm việc làm thành công!',
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
    return this.workExperiencesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workExperiencesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWorkExperienceDto: UpdateWorkExperienceDto,
  ) {
    return this.workExperiencesService.update(+id, updateWorkExperienceDto);
  }

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
