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
} from '@nestjs/common';
import { Response } from 'express';
import { rtPageInfoAndItems } from 'src/common/utils/function';

import { CreateFunctionalGroupDto } from 'src/dto/functional_groups/create-functional_group.dto';
import { UpdateFunctionalGroupDto } from 'src/dto/functional_groups/update-functional_group.dto';
import { FunctionalGroupsService } from 'src/services/functional_groups.service';

@Controller('functional-groups')
export class FunctionalGroupsController {
  constructor(
    private readonly functionalGroupsService: FunctionalGroupsService,
  ) {}

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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFunctionalGroupDto: UpdateFunctionalGroupDto,
  ) {
    return this.functionalGroupsService.update(+id, updateFunctionalGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.functionalGroupsService.remove(+id);
  }
}
