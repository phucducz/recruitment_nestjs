import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersSkillsService } from './users_skills.service';
import { CreateUsersSkillDto } from './dto/create-users_skill.dto';
import { UpdateUsersSkillDto } from './dto/update-users_skill.dto';

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
  update(@Param('id') id: string, @Body() updateUsersSkillDto: UpdateUsersSkillDto) {
    return this.usersSkillsService.update(+id, updateUsersSkillDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersSkillsService.remove(+id);
  }
}
