import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { CreateUsersJobDto } from 'src/dto/users_jobs/create-users_job.dto';
import { UpdateUsersJobDto } from 'src/dto/users_jobs/update-users_job.dto';
import { UsersJobsService } from '../../services/users_jobs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users-jobs')
export class UsersJobsController {
  constructor(private readonly usersJobsService: UsersJobsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createUsersJobDto: CreateUsersJobDto,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      const result = await this.usersJobsService.create({
        createBy: request.user.userId,
        variable: createUsersJobDto,
      });

      if (!result?.jobsId)
        return res
          .status(401)
          .json({ message: 'Ứng tuyển không thành công!', statusCode: 401 });

      return res
        .status(200)
        .json({ message: 'Ứng tuyển thành công!', statusCode: 200 });
    } catch (error) {
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
