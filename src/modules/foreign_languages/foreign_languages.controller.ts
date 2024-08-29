import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ForeignLanguagesService } from './foreign_languages.service';
import { CreateForeignLanguageDto } from './dto/create-foreign_language.dto';
import { UpdateForeignLanguageDto } from './dto/update-foreign_language.dto';

@Controller('foreign-languages')
export class ForeignLanguagesController {
  constructor(private readonly foreignLanguagesService: ForeignLanguagesService) {}

  @Post()
  create(@Body() createForeignLanguageDto: CreateForeignLanguageDto) {
    return this.foreignLanguagesService.create(createForeignLanguageDto);
  }

  @Get()
  findAll() {
    return this.foreignLanguagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foreignLanguagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateForeignLanguageDto: UpdateForeignLanguageDto) {
    return this.foreignLanguagesService.update(+id, updateForeignLanguageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foreignLanguagesService.remove(+id);
  }
}
