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

import { CreateRolesFunctionalDto } from 'src/dto/roles_functionals/create-roles_functional.dto';
import { UpdateRolesFunctionalDto } from 'src/dto/roles_functionals/update-roles_functional.dto';
import { RolesFunctionalsService } from 'src/services/roles_functionals.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';

@Controller('roles-functionals')
export class RolesFunctionalsController {
  constructor(
    private readonly rolesFunctionalsService: RolesFunctionalsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createRolesFunctionalDto: CreateRolesFunctionalDto,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      const result = await this.rolesFunctionalsService.create({
        variable: createRolesFunctionalDto,
        createBy: request.user.userId,
      });

      if (!result)
        return res.status(401).json({
          statusCode: 401,
          message: 'Tạo chức năng cho quyền không thành công!',
        });

      return res.status(200).json({
        statusCode: 200,
        message: 'Tạo chức năng cho quyền thành công!',
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: `Tạo chức năng cho quyền không thành công. ${error?.message}`,
      });
    }
  }

  @Get()
  findAll() {
    return this.rolesFunctionalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesFunctionalsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRolesFunctionalDto: UpdateRolesFunctionalDto,
  ) {
    return this.rolesFunctionalsService.update(+id, updateRolesFunctionalDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.rolesFunctionalsService.remove(+id);

      if (!result)
        return res.status(401).json({
          statusCode: 401,
          message: 'Xoá chức năng cho quyền không thành công!',
        });

      return res.status(200).json({
        statusCode: 200,
        message: 'Xoá chức năng cho quyền thành công!',
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: `Xoá chức năng cho quyền không thành công. ${error?.message}`,
      });
    }
  }
}
