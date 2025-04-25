import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

export const cloudinaryStorageCV = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: () => ({
    folder: 'recruitment-media/CVs',
    allowedFormats: ['jpg', 'png', 'pdf'],
  }),
});

export const cloudinaryStorageIcon = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: () => ({
    folder: 'recruitment-media/icons',
    allowedFormats: ['jpg', 'jpeg', 'png', 'svg+xml'],
  }),
});
