import {
  Controller,
  Inject,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { CloudinaryService } from 'src/services/cloudinary.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { cloudinaryStorage } from './cloudinary-storage.config';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(
    @Inject(CloudinaryService)
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/upload/CVs')
  @UseInterceptors(FileInterceptor('file', { storage: cloudinaryStorage }))
  async uploadCV(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      const result = await this.cloudinaryService.uploadFileByPath(file.path);

      if (result?.http_code === 400)
        return res.status(400).json({
          message: `Tải file thất bại. ${result?.message}!`,
          stausCode: 400,
        });

      return res.status(200).json({
        message: 'Tải file thành công!',
        stausCode: 200,
        url: result?.secure_url,
        publicId: result?.public_id,
        createAt: result?.created_at,
        originFileName: result?.original_filename,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message ?? error, statusCode: 500 });
    }
  }
}
