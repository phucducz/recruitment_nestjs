import {
  Body,
  Controller,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { CreateWorkTypeDto } from 'src/dto/work_types/create-work_type.dto';
import { WorkTypesService } from '../../services/work_types.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('work-types')
export class WorkTypesController {
  constructor(private readonly workTypesService: WorkTypesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createWorkTypeDto: CreateWorkTypeDto,
    @Request() request: any,
    @Res() res: Response,
  ) {
    try {
      const result = await this.workTypesService.create({
        createBy: request.user.userId,
        variable: createWorkTypeDto,
      });

      if (result.id)
        return res.status(200).json({ message: 'Thêm thành công!', ...result });

      return res.status(401).json({ message: 'Thêm mới không thành công!' });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/many')
  async createMany(
    @Body() createManyWorkTypes: CreateWorkTypeDto[],
    @Request() request: any,
    @Res() res: Response,
  ) {
    try {
      const result = await this.workTypesService.createMany({
        createBy: request.user.userId,
        variables: createManyWorkTypes,
      });

      if (result.length > 0)
        return res.status(200).json({ message: 'Thêm thành công!', ...result });

      return res.status(401).json({ message: 'Thêm mới không thành công!' });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  // @Get()
  // findAll() {
  //   return this.workTypesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.workTypesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateWorkTypeDto: UpdateWorkTypeDto,
  // ) {
  //   return this.workTypesService.update(+id, updateWorkTypeDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.workTypesService.remove(+id);
  // }
}
