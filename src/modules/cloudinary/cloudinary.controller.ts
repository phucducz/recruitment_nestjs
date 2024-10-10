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

import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { CloudinaryService } from 'src/services/cloudinary.service';
import { CurriculumVitaesService } from 'src/services/curriculum_vitaes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { cloudinaryStorage } from './cloudinary-storage.config';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(
    @Inject(CloudinaryService)
    private readonly cloudinaryService: CloudinaryService,
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
      if (files.length <= 0)
        return res
          .status(200)
          .json({ message: 'Vui lòng chọn file để tải lên!', statusCode: 200 });

      const result = await this.cloudinaryService.uploadManyFilesByPath(
        files.map((file) => file.path),
      );

      const failedUploadFiles = result.filter((item) => item.http_code === 400);

      if (failedUploadFiles.length > 0) {
        const successfullyUploadFiles = result.filter(
          (item) => item.http_code !== 400,
        );

        await this.cloudinaryService.deleteManyFiles(
          successfullyUploadFiles.map((item) => item.public_id),
        );

        return res.status(400).json({
          message: `Tải file thất bại. ${failedUploadFiles[0]?.message}!`,
          stausCode: 400,
        });
      }

      const cvs = await this.curriculumVitaesService.createMany({
        createBy: request.user.userId,
        variables: result.map((item) => item.secure_url),
      });

      if (cvs.length <= 0) {
        await this.cloudinaryService.deleteManyFiles(
          result.map((item) => item.public_id),
        );

        return res.status(401).json({
          message: `Lưu dữ liệu vào cơ sở dữ liệu thất bại. Tải file không thành công!`,
          stausCode: 401,
        });
      }

      return res.status(200).json({
        message: 'Tải file thành công!',
        stausCode: 200,
        items: result.map(
          (item: UploadApiResponse | UploadApiErrorResponse) => ({
            url: item?.secure_url,
            publicId: item?.public_id,
            createAt: item?.created_at,
            originFileName: item?.original_filename,
          }),
        ),
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message ?? error, statusCode: 500 });
    }
  }
}
