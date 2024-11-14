import {
  Controller,
  Inject,
  Post,
  Request,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { CurriculumVitaesService } from 'src/services/curriculum_vitaes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { cloudinaryStorage } from './cloudinary-storage.config';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(
    @Inject(CurriculumVitaesService)
    private readonly curriculumVitaesService: CurriculumVitaesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/upload/CVs')
  @UseInterceptors(
    FilesInterceptor('files', 10, { storage: cloudinaryStorage }),
  )
  async uploadCVs(
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      if (!files || files.length <= 0)
        return res
          .status(200)
          .json({ message: 'Vui lòng chọn file để tải lên!', statusCode: 200 });

      await this.curriculumVitaesService.createMany({
        createBy: request.user.userId,
        variables: files.map((file) => ({
          fileName: file.originalname,
          url: file.path,
        })),
      });

      return res.status(200).json({
        message: 'Tải file thành công!',
        statusCode: 200,
        items: files.map((item) => ({
          url: item.path,
          originFileName: item.originalname,
        })),
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message ?? error, statusCode: 500 });
    }
  }
}
