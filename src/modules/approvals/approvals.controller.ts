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

import { CreateApprovalDto } from 'src/dto/approvals/create-approval.dto';
import { UpdateApprovalDto } from 'src/dto/approvals/update-approval.dto';
import { ApprovalsService } from 'src/services/approvals.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { rtPageInfoAndItems } from 'src/common/utils/function';

@Controller('approvals')
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createApprovalDto: CreateApprovalDto,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      const result = await this.approvalsService.create({
        createBy: request.user.userId,
        variable: createApprovalDto,
      });

      if (!result)
        return res.status(401).json({
          message: 'Tạo công việc mong muốn không thành công!',
          statusCode: 401,
        });

      return res.status(200).json({
        message: 'Tạo công việc mong muốn thành công!',
        statusCode: 200,
      });
    } catch (error) {
      return res.status(500).json({
        message: `Tạo công việc mong muốn không thành công. ${error?.message ?? error}!`,
        statusCode: 500,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  async indAll(
    @Query() approvalQueries: ApprovalQueries,
    @Res() res: Response,
  ) {
    try {
      const { page, pageSize } = approvalQueries;
      const result = await this.approvalsService.findAll(approvalQueries);

      return res.status(200).json({
        statusCode: 200,
        ...rtPageInfoAndItems({ page, pageSize }, result),
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message ?? error, statusCode: 500 });
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.approvalsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateApprovalDto: UpdateApprovalDto,
  ) {
    return this.approvalsService.update(+id, updateApprovalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.approvalsService.remove(+id);
  }
}
