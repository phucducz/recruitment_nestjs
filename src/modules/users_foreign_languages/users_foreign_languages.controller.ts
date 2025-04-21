import {
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
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSION } from 'src/common/utils/enums';
import { rtPageInfoAndItems } from 'src/common/utils/function';
import { CreateUsersForeignLanguageDto } from 'src/dto/users_foreign_languages/create-users_foreign_language.dto';
import { UpdateUsersForeignLanguageDto } from 'src/dto/users_foreign_languages/update-users_foreign_language.dto';
import { UsersForeignLanguagesService } from '../../services/users_foreign_languages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionGuard } from '../auth/permission.guard';

@Controller('users-foreign-languages')
export class UsersForeignLanguagesController {
  constructor(
    private readonly usersForeignLanguagesService: UsersForeignLanguagesService,
  ) {}

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PERMISSION.EDIT_PROFILE)
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

  @Get('/all')
  async findAll(
    @Query() userForeignLanguageQueries: IFindUserForeignLanguagesQueries,
    @Res() res: Response,
  ) {
    try {
      const result = await this.usersForeignLanguagesService.findAll(
        userForeignLanguageQueries,
      );

      return res.status(200).json({
        statusCode: 200,
        ...rtPageInfoAndItems(
          {
            page: +userForeignLanguageQueries.page,
            pageSize: +userForeignLanguageQueries.pageSize,
          },
          result,
        ),
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message ?? error, statusCode: 500 });
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersForeignLanguagesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PERMISSION.EDIT_PROFILE)
  @Patch(':foreignLanguagesId')
  async update(
    @Param('foreignLanguagesId') foreignLanguagesId: number,
    @Body() updateUsersForeignLanguageDto: UpdateUsersForeignLanguageDto,
    @Request() request: any,
    @Res() res: Response,
  ) {
    try {
      const result = await this.usersForeignLanguagesService.update({
        updateBy: request.user.userId,
        variable: updateUsersForeignLanguageDto,
        queries: { foreignLanguagesId, usersId: request.user.userId },
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

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PERMISSION.EDIT_PROFILE)
  @Delete(':foreignLanguagesId')
  async remove(
    @Param('foreignLanguagesId') foreignLanguagesId: number,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      const result = await this.usersForeignLanguagesService.remove({
        foreignLanguagesId,
        usersId: request.user.userId,
      });

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
