import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

export const cloudinaryStorage = (configService: ConfigService) =>
  new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async () => {
      return {
        folder: `${configService.get<string>('CLOUDINARY_CVs_FOLDER')}`,
        allowedFormats: ['jpg', 'png', 'pdf'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
      };
    },
  });
