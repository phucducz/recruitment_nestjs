import { Body, Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { rtPageInfoAndItems } from 'src/common/utils/function';
import { PaginationDto } from 'src/dto/pagination/pagination.dto';
import { UsersService } from '../../services/users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
  @Get('/all')
  async findAll(@Body() pagination: PaginationDto, @Res() res: Response) {
    const result = await this.usersService.findAll(pagination);

    return res.status(200).json({ ...rtPageInfoAndItems(pagination, result) });
  }

  @UseGuards(JwtAuthGuard)
  @Get('?')
  findMe(@Query('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
