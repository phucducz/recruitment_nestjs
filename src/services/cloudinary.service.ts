import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(@Inject() private readonly configService: ConfigService) {}

  async uploadFile(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    try {
      return await cloudinary.uploader.upload(file.path, {
        folder: `${this.configService.get<string>('CLOUDINARY_CVs_FOLDER')}`,
      });
    } catch (error) {
      throw new Error('Tải file thất bại');
    }
  }
}
