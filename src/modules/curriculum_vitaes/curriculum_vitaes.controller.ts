import {
  Controller,
  Delete,
  Get,
  Param,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSION } from 'src/common/utils/enums';
import { CurriculumVitaesService } from 'src/services/curriculum_vitaes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionGuard } from '../auth/permission.guard';

@Controller('curriculum-vitaes')
export class CurriculumVitaesController {
  constructor(
    private readonly curriculumVitaesService: CurriculumVitaesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('my-CVs')
  async getMyCVs(@Request() request: any, @Res() res: Response) {
    try {
      const result = await this.curriculumVitaesService.findByUserId(
        request.user.userId,
      );

      return res.status(200).json({ items: result, statusCode: 200 });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message ?? error, statusCode: 500 });
    }
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions([PERMISSION.DELETE_RESUME])
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.curriculumVitaesService.remove(+id);

      if (!result)
        return res
          .status(401)
          .json({ message: 'Xóa CV không thành công!', statusCode: 401 });

      return res
        .status(200)
        .json({ message: 'Xóa CV thành công!', statusCode: 200 });
    } catch (error) {
      return res.status(500).json({
        message: `Xóa CV không thành công. ${error?.message ?? error}!`,
        statusCode: 500,
      });
    }
  }
}
