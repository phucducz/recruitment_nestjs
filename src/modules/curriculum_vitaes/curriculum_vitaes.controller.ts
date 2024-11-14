import { Controller, Get, Request, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { CurriculumVitaesService } from 'src/services/curriculum_vitaes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
}
