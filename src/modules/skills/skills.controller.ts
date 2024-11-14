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
import { CreateSkillDto } from 'src/dto/skills/create-skill.dto';
import { UpdateSkillDto } from 'src/dto/skills/update-skill.dto';
import { SkillsService } from '../../services/skills.service';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillsService.create(createSkillDto);
  }

  @Get('/all?')
  async findAll(@Query() skillQueries: ISkillQueries, @Res() res: Response) {
    try {
      const result = await this.skillsService.findAll(skillQueries);

      return res.status(200).json({
        statusCode: 200,
        ...rtPageInfoAndItems(
          { page: +skillQueries.page, pageSize: +skillQueries.pageSize },
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
    return this.skillsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillsService.update(+id, updateSkillDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skillsService.remove(+id);
  }
}
