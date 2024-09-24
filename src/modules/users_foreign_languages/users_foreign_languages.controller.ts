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

import { CreateUsersForeignLanguageDto } from 'src/dto/users_foreign_languages/create-users_foreign_language.dto';
import { UpdateUsersForeignLanguageDto } from 'src/dto/users_foreign_languages/update-users_foreign_language.dto';
import { UsersForeignLanguagesService } from '../../services/users_foreign_languages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users-foreign-languages')
export class UsersForeignLanguagesController {
  constructor(
    private readonly usersForeignLanguagesService: UsersForeignLanguagesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createUsersForeignLanguageDto: CreateUsersForeignLanguageDto,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      const result = await this.usersForeignLanguagesService.create({
        createBy: request.user.userId,
        variable: createUsersForeignLanguageDto,
      });

      if (!result)
        return res
          .status(401)
          .json({ message: 'Thêm ngoại ngữ thất bại', statusCode: 401 });

      return res.status(200).json({
        message: 'Thêm ngoại ngữ thành công',
        statusCode: 200,
        ...result,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error, statusCode: 500 });
    }
  }

  @Get()
  findAll() {
    return this.usersForeignLanguagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersForeignLanguagesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUsersForeignLanguageDto: UpdateUsersForeignLanguageDto,
    @Request() request: any,
    @Res() res: Response,
  ) {
    try {
      const result = await this.usersForeignLanguagesService.update(+id, {
        updateBy: request.user.userId,
        variable: updateUsersForeignLanguageDto,
      });

      if (!result)
        return res.status(401).json({
          message: 'Cập nhật trình độ ngoại ngữ không thành công',
          statusCode: 401,
        });

      return res.status(200).json({
        message: 'Cập nhật trình độ ngoại ngữ thành công',
        statusCode: 200,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error,
        statusCode: 500,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      console.log(`Delete request received at ${new Date().toISOString()} for ID: ${id}`);
      const result = await this.usersForeignLanguagesService.remove(+id);

      if (!result)
        return res.status(401).json({
          message: 'Xóa trình độ ngoại ngữ không thành công',
          statusCode: 401,
        });

      return res.status(200).json({
        message: 'Xóa trình độ ngoại ngữ thành công',
        statusCode: 200,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error,
        statusCode: 500,
      });
    }
  }
}
