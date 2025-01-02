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

import { rtPageInfoAndItems } from 'src/common/utils/function';
import { CreateFunctionalGroupDto } from 'src/dto/functional_groups/create-functional_group.dto';
import { UpdateFunctionalGroupDto } from 'src/dto/functional_groups/update-functional_group.dto';
import { FunctionalGroupsService } from 'src/services/functional_groups.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('functional-groups')
export class FunctionalGroupsController {
  constructor(
    private readonly functionalGroupsService: FunctionalGroupsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createFunctionalGroupDto: CreateFunctionalGroupDto,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      const result = await this.functionalGroupsService.create({
        createBy: request.user.userId,
        variable: createFunctionalGroupDto,
      });

      if (!result)
        return res
          .status(401)
          .json({ message: 'Tạo nhóm chức năng thất bại!', statusCode: 401 });

      return res.status(200).json({
        statusCode: 200,
        message: 'Tạo mới nhóm chức năng thành công!',
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: `Tạo mới nhóm chức năng không thành công, ${error?.message}`,
      });
    }
  }

  @Get('/all')
  async findAll(
    @Query() functionalGroupQueries: FunctionalGroupQueries,
    @Res() res: Response,
  ) {
    const { page, pageSize } = functionalGroupQueries;
    const result = await this.functionalGroupsService.findAll(
      functionalGroupQueries,
    );

    return res.status(200).json({
      statusCode: 200,
      ...rtPageInfoAndItems({ page, pageSize }, result),
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.functionalGroupsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFunctionalGroupDto: UpdateFunctionalGroupDto,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      const result = await this.functionalGroupsService.update(+id, {
        updateBy: request.user.userId,
        variable: updateFunctionalGroupDto,
      });

      if (!result)
        return res.status(401).json({
          message: 'Cập nhật nhóm chức năng không thành công!',
          statusCode: 401,
        });

      return res.status(200).json({
        statusCode: 200,
        message: 'Cập nhật nhóm chức năng thành công!',
      });
    } catch (error) {
      return res.status(500).json({
        message: `Cập nhật nhóm chức năng không thành công. ${error?.message}`,
        statusCode: 500,
      });
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.functionalGroupsService.remove(+id);
  }
}
