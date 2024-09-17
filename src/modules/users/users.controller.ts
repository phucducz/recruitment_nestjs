import { Body, Controller, Get, Query, UseGuards } from '@nestjs/common';

import { UsersService } from '../../services/users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaginationDto } from 'src/dto/pagination/pagination.dto';

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

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  findAll(@Body() pagination: PaginationDto) {
    return this.usersService.findAll(pagination);
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
