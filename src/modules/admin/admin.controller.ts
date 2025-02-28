import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { rtPageInfoAndItems } from 'src/common/utils/function';
import { UsersService } from 'src/services/users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdatUserByAdminDto } from 'src/dto/admin/update-user.dto';
import { AdminService } from 'src/services/admin.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  @Get('/all')
  async findAll(@Query() userQueries: IUserQueries, @Res() res: Response) {
    const paginationParams = {
      page: +userQueries.page,
      pageSize: +userQueries.pageSize,
    };

    try {
      const result = await this.usersService.findAll(userQueries);

      return res
        .status(200)
        .json({ ...rtPageInfoAndItems(paginationParams, result) });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message ?? error, statusCode: 500 });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update-user/:userId')
  async updateUserRole(
    @Param('userId') userId: string,
    @Body() updatUserByAdminDto: UpdatUserByAdminDto,
    @Request() request: any,
    @Res() res: Response,
  ) {
    try {
      const result = await this.adminService.updateUserRole({
        updateBy: request.user.userId,
        variable: { ...updatUserByAdminDto, userId: +userId },
      });

      if (!result)
        return res.status(401).json({
          message: 'Cập nhật chức vụ thất bại!',
          statusCode: 401,
        });

      return res
        .status(200)
        .json({ message: 'Cập nhật thông tin user thành công', statusCode: 200 });
    } catch (error) {
      return res.status(500).json({
        message: `Cập nhật không thành công: ${error?.message ?? error}!`,
        statusCode: 500,
      });
    }
  }
}
