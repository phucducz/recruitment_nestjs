import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { rtPageInfoAndItems } from 'src/common/utils/function';
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

  @Get('/all?')
  async findAll(
    @Query() foreignLanguageQueries: IForeignLanguageQueries,
    @Res() res: Response,
  ) {
    try {
      const result = await this.foreignLanguagesService.findAll(
        foreignLanguageQueries,
      );

      return res.status(200).json({
        statusCode: 200,
        ...rtPageInfoAndItems(
          {
            page: +foreignLanguageQueries.page,
            pageSize: +foreignLanguageQueries.pageSize,
          },
          result,
        ),
      });
    } catch (error) {
      return res
        .status(500)
        .json({ statusCode: 500, message: error?.message ?? error });
    }
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
