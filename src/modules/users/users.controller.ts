import {
  BadRequestException,
  Body,
  Controller,
  forwardRef,
  Get,
  Inject,
  NotFoundException,
  Patch,
  Query,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSION } from 'src/common/utils/enums';
import { ChangePasswordDto } from 'src/dto/users/change-password.dto';
import { ResetPasswordDto } from 'src/dto/users/reset-password.dto';
import { UpdateAccountInfoDto } from 'src/dto/users/update-accounnt-info.dto';
import { UpdatePersonalInfoDto } from 'src/dto/users/update-personal-info.dto';
import { ResetPasswordService } from 'src/services/forgot_password.service';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionGuard } from '../auth/permission.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(ResetPasswordService)
    private readonly resetPasswordService: ResetPasswordService,
  ) {}

  @Get('/check-exist-email')
  async checkExistEmail(@Query('email') email: string, @Res() res: Response) {
    try {
      const result = await this.usersService.findByEmail(email, {
        hasPassword: true,
      });

      if (!result)
        return res
          .status(404)
          .json({ message: 'Email không tồn tại!', statusCode: 404 });

      return res.status(200).json({
        email,
        message: 'Email tồn tại',
        hasPassword: !!result.password,
        signInWith: result.password ? 'system' : 'other',
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

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions([PERMISSION.USER_UPDATE_ACCOUNT])
  @Patch('/account-info')
  @UseInterceptors(FileInterceptor('file'))
  async updateAccountInfo(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateAccountInfoDto: UpdateAccountInfoDto,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      const isChangePassword = updateAccountInfoDto.isChangePassword;

      const result = await this.usersService.updateAccountInfo({
        updateBy: request.user.userId,
        variable: {
          ...updateAccountInfoDto,
          file,
          isChangePassword:
            typeof isChangePassword === 'boolean'
              ? isChangePassword
              : isChangePassword === 'true',
        },
      });

      if (!result)
        return res.status(401).json({
          message: 'Thay đổi thông tin người dùng không thành công',
          statusCode: 401,
        });

      return res.status(200).json({
        statusCode: 200,
        message: 'Thay đổi thông tin người dùng thành công',
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;

      return res.status(500).json({
        statusCode: 500,
        message: `Thay đổi thông tin người dùng thất bại. ${error?.message ?? error}`,
      });
    }
  }

  @Patch('/reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res() res: Response,
  ) {
    try {
      const { token, email } = resetPasswordDto;
      const userId = await this.resetPasswordService.verify({ email, token });

      if (
        !(await this.usersService.updatePassword(
          userId,
          await this.authService.hashPassword(resetPasswordDto.password),
        ))
      )
        return res
          .status(401)
          .json({ message: 'Đặt lại mật khẩu thất bại', statusCode: 401 });

      this.resetPasswordService.delete(token);

      return res
        .status(200)
        .json({ message: 'Đặt lại mật khẩu thành công', statusCode: 200 });
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions({
    match: 'any',
    permissions: [
      PERMISSION.EDIT_USER_PROFILE,
      PERMISSION.EDIT_EMPLOYER_PROFILE,
    ],
  })
  @Patch('/personal-info')
  @UseInterceptors(FileInterceptor('file'))
  async updatePersonalInfo(
    @UploadedFile('file') file: Express.Multer.File,
    @Body() updatePersonalInfoDto: UpdatePersonalInfoDto,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      const result = await this.usersService.updatePersonalInfo({
        updateBy: request.user.userId,
        variable: {
          ...updatePersonalInfoDto,
          file,
        },
      });

      if (!result)
        return res.status(401).json({
          message: 'Cập nhật thông tin cá nhân thất bại!',
          statusCode: 401,
        });

      return res.status(200).json({
        message: 'Cập nhật thông tin cá nhân thành công!',
        statusCode: 200,
      });
    } catch (error) {
      return res.status(500).json({
        message: `Cập nhật thông tin cá nhân thất bại. ${error?.message ?? error}!`,
        statusCode: 500,
      });
    }
  }
}
