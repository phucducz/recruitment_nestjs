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
import { CreateUsersSkillDto } from 'src/dto/users_skills/create-users_skill.dto';
import { UpdateUsersSkillDto } from 'src/dto/users_skills/update-users_skill.dto';
import { UsersSkillsService } from '../../services/users_skills.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users-skills')
export class UsersSkillsController {
  constructor(private readonly usersSkillsService: UsersSkillsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createUsersSkillDto: CreateUsersSkillDto,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      const result = await this.usersSkillsService.create({
        createBy: request.user.userId,
        variable: createUsersSkillDto,
      });

      if (!result)
        return res
          .status(401)
          .json({ message: 'Thêm kỹ năng không thành công', statusCode: 401 });

      return res.status(200).json({
        message: 'Thêm kỹ năng thành công',
        statusCode: 200,
        ...result,
      });
    } catch (error) {
      console.log(error);
    }
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
