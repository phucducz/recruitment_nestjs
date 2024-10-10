import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';

import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUsersJobDto } from 'src/dto/users_jobs/create-users_job.dto';
import { UpdateUsersJobDto } from 'src/dto/users_jobs/update-users_job.dto';
import { CloudinaryService } from 'src/services/cloudinary.service';
import { CurriculumVitaesService } from 'src/services/curriculum_vitaes.service';
import { UsersJobsService } from '../../services/users_jobs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { cloudinaryStorage } from '../cloudinary/cloudinary-storage.config';

@Controller('users-jobs')
export class UsersJobsController {
  constructor(
    private readonly usersJobsService: UsersJobsService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly curriculumVitaesService: CurriculumVitaesService,
  ) {}

  // @UseGuards(JwtAuthGuard)
  // @Post()
  // async create(
  //   @Body() createUsersJobDto: CreateUsersJobDto,
  //   @Res() res: Response,
  //   @Request() request: any,
  // ) {
  //   try {
  //     const result = await this.usersJobsService.create({
  //       createBy: request.user.userId,
  //       variable: createUsersJobDto,
  //     });

  //     if (!result?.jobsId)
  //       return res
  //         .status(401)
  //         .json({ message: 'Ứng tuyển không thành công!', statusCode: 401 });

  //     return res
  //       .status(200)
  //       .json({ message: 'Ứng tuyển thành công!', statusCode: 200 });
  //   } catch (error) {
  //     return res
  //       .status(500)
  //       .json({ message: error?.message ?? error, statusCode: 500 });
  //   }
  // }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: cloudinaryStorage }))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createUsersJobDto: any,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      let data = {
        ...createUsersJobDto,
        jobsId: +createUsersJobDto?.jobsId,
      } as CreateUsersJobDto;
      const createBy = request.user.userId;

      const isApplied = await this.usersJobsService.isApplied({
        jobsId: data.jobsId,
        usersId: createBy,
      });

      if (isApplied)
        throw new BadRequestException(
          'Bạn đã ứng tuyển công việc này, hãy kiểm tra danh sách công việc bạn đã ứng tuyển!',
        );

      if (file) {
        const uploadResult = await this.cloudinaryService.uploadFileByPath(
          file.path,
        );
        const saveCVResult = await this.curriculumVitaesService.create({
          createBy,
          variable: { url: uploadResult.secure_url },
        });

        if (!saveCVResult?.id) {
          return res.status(401).json({
            message: `Lưu dữ liệu vào cơ sở dữ liệu thất bại. Tải file không thành công!`,
            statusCode: 401,
          });
        }

        data.curriculumVitaeURL = uploadResult.secure_url;
      }

      const result = await this.usersJobsService.aplly({
        createBy,
        variable: data,
      });

      if (!result?.jobsId)
        return res
          .status(401)
          .json({ message: 'Ứng tuyển không thành công!', statusCode: 401 });

      return res
        .status(200)
        .json({ message: 'Ứng tuyển thành công!', statusCode: 200 });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      return res
        .status(500)
        .json({ message: error?.message ?? error, statusCode: 500 });
    }
  }

  @Get()
  findAll() {
    return this.usersJobsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersJobsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUsersJobDto: UpdateUsersJobDto,
  ) {
    return this.usersJobsService.update(+id, updateUsersJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersJobsService.remove(+id);
  }
}
