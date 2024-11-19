import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { rtPageInfoAndItems } from 'src/common/utils/function';
import { CreateUsersJobDto } from 'src/dto/users_jobs/create-users_job.dto';
import { UpdateUsersJobDto } from 'src/dto/users_jobs/update-users_job.dto';
import { CloudinaryService } from 'src/services/cloudinary.service';
import { CurriculumVitaesService } from 'src/services/curriculum_vitaes.service';
import { UsersJobsService } from '../../services/users_jobs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
  @UseInterceptors(FileInterceptor('file'))
  async applyForAJob(
    @UploadedFile() file: Express.Multer.File,
    @Body() createUsersJobDto: CreateUsersJobDto,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      let data = {
        ...createUsersJobDto,
        jobsId: +(createUsersJobDto?.jobsId ?? '0'),
        curriculumVitaesId: +(createUsersJobDto?.curriculumVitaesId ?? '0'),
      } as CreateUsersJobDto;
      const createBy = request.user.userId;

      const isApplied = await this.usersJobsService.isApplied({
        jobsId: +data.jobsId,
        usersId: createBy,
      });

      if (isApplied)
        throw new BadRequestException(
          'Bạn đã ứng tuyển công việc này, hãy kiểm tra danh sách công việc bạn đã ứng tuyển!',
        );

      if (file) {
        const uploadResult = await this.cloudinaryService.uploadFile(file);
        const saveCVResult = await this.curriculumVitaesService.create({
          createBy,
          variable: {
            url: uploadResult.secure_url,
            fileName: file.originalname,
          },
        });

        if (!saveCVResult?.id) {
          return res.status(401).json({
            message: `Lưu dữ liệu vào cơ sở dữ liệu thất bại. Tải file không thành công!`,
            statusCode: 401,
          });
        }

        data.curriculumVitaesId = saveCVResult.id;
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

  @UseGuards(JwtAuthGuard)
  @Get('/applied-jobs')
  async findAppliedJobs(
    @Query() appliedJobQueries: IAppliedJobQueries,
    @Request() request: any,
    @Res() res: Response,
  ) {
    const result = await this.usersJobsService.findAppliedJobsOfUser({
      ...appliedJobQueries,
      usersId: request.user.userId,
    });

    return res.status(200).json({
      ...rtPageInfoAndItems(
        {
          page: +appliedJobQueries.page,
          pageSize: +appliedJobQueries.pageSize,
        },
        result,
      ),
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/applicants')
  async findApplicantsForJob(
    @Query() applicantsQueries: Omit<IFindApplicantsQueries, 'usersId'>,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      const result = await this.usersJobsService.findApplicantsForJob({
        ...applicantsQueries,
        usersId: request?.user?.userId,
      });

      return res.status(200).json({
        statusCode: 200,
        ...rtPageInfoAndItems(
          {
            page: applicantsQueries.page,
            pageSize: applicantsQueries.pageSize,
          },
          result,
        ),
      });
    } catch (error) {
      return res
        .status(500)
        .json({ statusCode: 500, message: `Lỗi. ${error?.message ?? error}` });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/applicants/detail')
  async findApplicantDetail(
    @Query() findApplicantDetailQueries: IFindApplicantDetailQueries,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      const result = await this.usersJobsService.findApplicantDetail({
        ...findApplicantDetailQueries,
        updateBy: +request.user.userId,
      });

      return res.status(200).json({ statusCode: 200, ...result });
    } catch (error) {
      return res
        .status(500)
        .json({ statusCode: 500, message: `Lỗi. ${error?.message ?? error}` });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(
    @Body() updateUsersJobDto: UpdateUsersJobDto,
    @Request() request: any,
    @Res() res: Response,
  ) {
    try {
      const result = await this.usersJobsService.update({
        updateBy: request.user.userId,
        variable: updateUsersJobDto,
      });

      if (!result)
        return res.status(401).json({
          statusCode: 401,
          message: 'Cập nhật công việc đã ứng tuyển thất bại!',
        });

      return res.status(200).json({
        statusCode: 200,
        message: 'Cập nhật công việc đã ứng tuyển thành công!',
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: `Cập nhật công việc đã ứng tuyển thất bại. ${error?.message ?? error}!`,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/applicants/monthly-statistic')
  async getMonthlyCandidateStatisticsByYear(
    @Query() queries: { year: string },
    @Res() res: Response,
  ) {
    try {
      const result =
        await this.usersJobsService.getMonthlyCandidateStatisticsByYear(
          queries.year,
        );

      return res.status(200).json({ statusCode: 200, ...result });
    } catch (error) {
      return res
        .status(500)
        .json({ statusCode: 500, message: error?.message ?? error });
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersJobsService.remove(+id);
  }
}
