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

      return res
        .status(200)
        .json({ message: 'Thêm ngoại ngữ thành công', statusCode: 200 });
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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUsersForeignLanguageDto: UpdateUsersForeignLanguageDto,
  ) {
    return this.usersForeignLanguagesService.update(
      +id,
      updateUsersForeignLanguageDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersForeignLanguagesService.remove(+id);
  }
}
