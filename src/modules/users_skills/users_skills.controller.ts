import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateUsersSkillDto } from 'src/dto/users_skills/create-users_skill.dto';
import { UpdateUsersSkillDto } from 'src/dto/users_skills/update-users_skill.dto';
import { UsersSkillsService } from '../../services/users_skills.service';

@Controller('users-skills')
export class UsersSkillsController {
  constructor(private readonly usersSkillsService: UsersSkillsService) {}

  @Post()
  create(@Body() createUsersSkillDto: CreateUsersSkillDto) {
    return this.usersSkillsService.create(createUsersSkillDto);
  }

  @Get()
  findAll() {
    return this.usersSkillsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersSkillsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUsersSkillDto: UpdateUsersSkillDto,
  ) {
    return this.usersSkillsService.update(+id, updateUsersSkillDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersSkillsService.remove(+id);
  }
}
