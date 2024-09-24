import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { CreateForeignLanguageDto } from 'src/dto/foreign_languages/create-foreign_language.dto';
import { UpdateForeignLanguageDto } from 'src/dto/foreign_languages/update-foreign_language.dto';
import { ForeignLanguagesService } from '../../services/foreign_languages.service';

@Controller('foreign-languages')
export class ForeignLanguagesController {
  constructor(
    private readonly foreignLanguagesService: ForeignLanguagesService,
  ) {}

  @Post()
  create(@Body() createForeignLanguageDto: CreateForeignLanguageDto) {
    return this.foreignLanguagesService.create(createForeignLanguageDto);
  }

  @Get()
  findAll() {
    return this.foreignLanguagesService.findAll();
  }

  @Get('?')
  findOne(@Query('id') id: number) {
    return this.foreignLanguagesService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateForeignLanguageDto: UpdateForeignLanguageDto,
  ) {
    return this.foreignLanguagesService.update(+id, updateForeignLanguageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foreignLanguagesService.remove(+id);
  }
}
