import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateAchivementDto } from 'src/dto/achivements/create-achivement.dto';
import { UpdateAchivementDto } from 'src/dto/achivements/update-achivement.dto';
import { AchivementsService } from '../../services/achivements.service';

@Controller('achivements')
export class AchivementsController {
  constructor(private readonly achivementsService: AchivementsService) {}

  @Post()
  create(@Body() createAchivementDto: CreateAchivementDto) {
    return this.achivementsService.create(createAchivementDto);
  }

  @Get()
  findAll() {
    return this.achivementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.achivementsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAchivementDto: UpdateAchivementDto,
  ) {
    return this.achivementsService.update(+id, updateAchivementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.achivementsService.remove(+id);
  }
}
