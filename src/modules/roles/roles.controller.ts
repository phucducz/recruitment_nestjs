import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateRoleDto } from 'src/dto/roles/create-role.dto';

import { RolesService } from 'src/services/roles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createRoleDto: CreateRoleDto,
    @Request() request: any,
    @Res() res: Response,
  ) {
    try {
      const result = await this.rolesService.create({
        createBy: request.user.userId,
        variable: createRoleDto,
      });

      if (result.id)
        return res.status(200).json({ message: 'Thêm thành công!', ...result });

      return res
        .status(401)
        .json({ message: 'Thêm mới không thành công!', ...result });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/many')
  async createMany(
    @Body() createManyRoleDto: CreateRoleDto[],
    @Request() request: any,
    @Res() res: Response,
  ) {
    try {
      const result = await this.rolesService.createMany({
        createBy: request.user.userId,
        variables: createManyRoleDto,
      });

      if (result.length > 0)
        return res
          .status(200)
          .json({ message: 'Thêm thành công!', records: result });

      return res
        .status(401)
        .json({ message: 'Thêm mới không thành công!', records: result });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.rolesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
  //   return this.rolesService.update(+id, updateRoleDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.rolesService.remove(+id);
  // }
}
