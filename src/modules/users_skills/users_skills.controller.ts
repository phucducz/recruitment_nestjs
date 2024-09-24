import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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

  @UseGuards(JwtAuthGuard)
  @Patch(':skillsId')
  async update(
    @Param('skillsId') skillsId: number,
    @Body() updateUsersSkillDto: UpdateUsersSkillDto,
    @Request() request: any,
    @Res() res: Response,
  ) {
    try {
      const result = await this.usersSkillsService.update({
        updateBy: request.user.userId,
        variable: updateUsersSkillDto,
        queries: { skillsId, usersId: request.user.userId },
      });

      if (!result)
        return res.status(401).json({
          message: 'Cập nhật kỹ năng không thành công',
          statusCode: 401,
        });

      return res.status(200).json({
        message: 'Cập nhật kỹ năng thành công',
        statusCode: 200,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error,
        statusCode: 500,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':skillsId')
  async remove(
    @Param('skillsId') skillsId: number,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      const result = await this.usersSkillsService.remove({
        skillsId,
        usersId: request.user.userId,
      });

      if (!result)
        return res.status(401).json({
          message: 'Xóa kỹ năng không thành công',
          statusCode: 401,
        });

      return res.status(200).json({
        message: 'Xóa kỹ năng thành công',
        statusCode: 200,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error,
        statusCode: 500,
      });
    }
  }
}
