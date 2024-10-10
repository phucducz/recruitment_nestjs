// import { Inject, Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import {
//   v2 as cloudinary,
//   UploadApiErrorResponse,
//   UploadApiResponse,
// } from 'cloudinary';

// @Injectable()
// export class CloudinaryService {
//   constructor(@Inject() private readonly configService: ConfigService) {}

//   async uploadFile(
//     file: Express.Multer.File,
//   ): Promise<UploadApiResponse | UploadApiErrorResponse> {
//     try {
//       return await cloudinary.uploader.upload(file.path, {
//         folder: 'recruitment-media/CVs',
//       });
//     } catch (error) {
//       throw new Error('Tải file thất bại');
//     }
//   }
// }

import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  private readonly folder = this.configService.get<string>(
    'CLOUDINARY_CVs_FOLDER',
  );

  async uploadFile(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      if (!file || !file.buffer) {
        reject(new Error('File buffer is empty or undefined'));
        return;
      }

      const upload = cloudinary.uploader.upload_stream(
        { folder: this.folder },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      const readableStream = Readable.from(file.buffer);
      readableStream.pipe(upload);
    });
  }

  async uploadFileByPath(
    filePath: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: this.folder,
      });

      return result;
    } catch (error) {
      throw new Error('Upload file thất bại');
    }
  }

  async uploadManyFilesByPath(
    listFilePaths: string[],
  ): Promise<Array<UploadApiResponse | UploadApiErrorResponse>> {
    return await Promise.all(
      listFilePaths.map((filePath) => this.uploadFileByPath(filePath)),
    );
  }

  async deleteFile(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

  async deleteManyFiles(publicIds: string[]): Promise<any> {
    return await Promise.all(
      publicIds.map((publicId) => this.deleteFile(publicId)),
    );
  }
}
