import {
  Body,
  Controller,
  forwardRef,
  Get,
  Inject,
  Patch,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { rtPageInfoAndItems } from 'src/common/utils/function';
import { ChangePasswordDto } from 'src/dto/users/change-password.dto';
import { ResetPasswordDto } from 'src/dto/users/reset-password.dto';
import { ForgotPasswordService } from 'src/services/forgot_password.service';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(ForgotPasswordService)
    private readonly forgotPasswordService: ForgotPasswordService,
  ) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  // @Get('?')
  // findByEmail(@Query('email') email: string) {
  //   return this.usersService.findByEmail(email);
  // }

  @Get('/check-exist-email')
  async checkExistEmail(@Query('email') email: string, @Res() res: Response) {
    try {
      const result = await this.usersService.findByEmail(email);

      if (!result)
        return res
          .status(404)
          .json({ message: 'Email không tồn tại!', statusCode: 404 });

      return res.status(200).json({
        email,
        message: 'Email tồn tại',
        hasPassword: result.password !== null,
        signInWith: result.password !== null ? 'system' : 'other',
        statusCode: 200,
      });
    } catch (error) {
      console.log(error);
      return res.status(200).json({
        message: error,
        statusCode: 500,
      });
    }
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/all?')
  async findAll(@Query() pagination: IPaginationQuery, @Res() res: Response) {
    const paginationParams = {
      page: +pagination.page,
      pageSize: +pagination.pageSize,
    };
    const result = await this.usersService.findAll(paginationParams);

    return res
      .status(200)
      .json({ ...rtPageInfoAndItems(paginationParams, result) });
  }

  @UseGuards(JwtAuthGuard)
  @Get('?')
  findByEmail(@Query('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async findMe(@Res() res: Response, @Request() request: any) {
    try {
      const result = await this.usersService.findById(request.user.userId, {
        hasRelations: false,
      });

      if (!result?.id)
        return res
          .status(404)
          .json({ message: 'Không thể tìm thấy user', statusCode: 404 });

      return res.status(200).json({ statusCode: 200, ...result });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error, statusCode: 500 });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async findProfile(@Res() res: Response, @Request() request: any) {
    try {
      const result = await this.usersService.findById(request.user.userId, {
        hasRelations: true,
      });

      if (!result?.id)
        return res
          .status(404)
          .json({ message: 'Không thể tìm thấy user', statusCode: 404 });

      return res.status(200).json({ statusCode: 200, ...result });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error, statusCode: 500 });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      const result = await this.usersService.changePassword({
        updateBy: request.user.userId,
        variable: changePasswordDto,
      });

      if (!result)
        return res.status(401).json({
          message: 'Thay đổi mật khẩu người dùng không thành công',
          statusCode: 401,
        });

      return res.status(200).json({
        statusCode: 200,
        message: 'Thay đổi mật khẩu người dùng thành công',
      });
    } catch (error) {
      throw error;
    }
  }

  @Patch('/reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res() res: Response,
  ) {
    try {
      const { token } = resetPasswordDto;
      const userId = await this.authService.verifyForgotPasswordToken(token);

      if (
        !(await this.usersService.updatePassword(
          userId,
          await this.authService.hashPassword(resetPasswordDto.password),
        ))
      )
        return res
          .status(401)
          .json({ message: 'Đặt lại mật khẩu thất bại', statusCode: 401 });

      this.authService.deleteForgotPasswordToken(token);

      return res
        .status(200)
        .json({ message: 'Đặt lại mật khẩu thành công', statusCode: 200 });
    } catch (error) {
      throw error;
    }
  }
}
