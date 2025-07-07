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

import { STATUS_CODE } from 'src/common/utils/enums';
import { rtPageInfoAndItems } from 'src/common/utils/function';
import { CreateApprovalDto } from 'src/dto/approvals/create-approval.dto';
import { UpdateApprovalDto } from 'src/dto/approvals/update-approval.dto';
import { ApprovalsService } from 'src/services/approvals.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
  async findAll(
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

  @UseGuards(JwtAuthGuard)
  @Get('/shared-candidates')
  async findAllCandidateProfile(
    @Query() candidateProfileQueries: CandidateProfileQueries,
    @Res() res: Response,
  ) {
    try {
      const { page, pageSize } = candidateProfileQueries;
      const { items, total } =
        await this.approvalsService.findAllCandidateProfile(
          candidateProfileQueries,
        );

      return res.status(200).json({
        statusCode: 200,
        ...rtPageInfoAndItems({ page, pageSize }, [
          items,
          Number(total?.count),
        ]),
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message ?? error, statusCode: 500 });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.approvalsService.findOne({
        where: { id: +id },
      });

      return res.status(200).json({
        statusCode: 200,
        ...result,
      });
    } catch (error) {
      return res.status(500).json({
        message: `Lỗi khi phê duyệt hồ sơ: ${error?.message ?? error}!`,
        statusCode: 500,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/approve/:id')
  async approve(
    @Param('id') id: string,
    @Body() updateApprovalDto: UpdateApprovalDto,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      const { code } = updateApprovalDto;
      const result = await this.approvalsService.approve(+id, {
        updateBy: request.user.userId,
        variable: updateApprovalDto,
      });

      if (!result)
        return res.status(401).json({
          message: 'Không thể cập nhật trạng thái hồ sơ!',
          statusCode: 401,
        });

      return res.status(200).json({
        message:
          code === STATUS_CODE.APPROVAL_APPROVED
            ? 'Hồ sơ đã được phê duyệt thành công!'
            : 'Hồ sơ đã bị từ chối',
        statusCode: 200,
      });
    } catch (error) {
      return res.status(500).json({
        message: `Lỗi khi phê duyệt hồ sơ: ${error?.message ?? error}!`,
        statusCode: 500,
      });
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.approvalsService.remove(+id);
  }
}
