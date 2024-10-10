import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: () => ({
    folder: 'recruitment-media/CVs',
    allowedFormats: ['jpg', 'png', 'pdf'],
  }),
});
