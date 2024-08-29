import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateUsersForeignLanguageDto } from 'src/dto/users_foreign_languages/create-users_foreign_language.dto';
import { UpdateUsersForeignLanguageDto } from 'src/dto/users_foreign_languages/update-users_foreign_language.dto';
import { UsersForeignLanguagesService } from '../../services/users_foreign_languages.service';

@Controller('users-foreign-languages')
export class UsersForeignLanguagesController {
  constructor(
    private readonly usersForeignLanguagesService: UsersForeignLanguagesService,
  ) {}

  @Post()
  create(@Body() createUsersForeignLanguageDto: CreateUsersForeignLanguageDto) {
    return this.usersForeignLanguagesService.create(
      createUsersForeignLanguageDto,
    );
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
