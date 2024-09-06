import { Controller } from '@nestjs/common';

import { UsersJobFieldsService } from '../../services/users_job_fields.service';

@Controller('users-job-fields')
export class UsersJobFieldsController {
  constructor(private readonly usersJobFieldsService: UsersJobFieldsService) {}

  // @Post()
  // create(@Body() createUsersJobFieldDto: CreateUsersJobFieldDto) {
  //   return this.usersJobFieldsService.create(createUsersJobFieldDto);
  // }

  // @Get()
  // findAll() {
  //   return this.usersJobFieldsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersJobFieldsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateUsersJobFieldDto: UpdateUsersJobFieldDto,
  // ) {
  //   return this.usersJobFieldsService.update(+id, updateUsersJobFieldDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersJobFieldsService.remove(+id);
  // }
}
