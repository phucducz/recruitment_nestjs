import { Controller } from '@nestjs/common';

@Controller('refresh-token')
export class RefreshTokenController {
  // constructor(private readonly refreshTokenService: RefreshTokenService) {}
  // @Post('/refresh')
  // create(@Body() refreshAccessTokenDto: RefreshAccessTokenDto) {
  //   return this.refreshTokenService.refresh(refreshAccessTokenDto);
  // }
  // @Get()
  // findAll() {
  //   return this.refreshTokenService.findAll();
  // }
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.refreshTokenService.findOne(+id);
  // }
  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateRefreshTokenDto: UpdateRefreshTokenDto,
  // ) {
  //   return this.refreshTokenService.update(+id, updateRefreshTokenDto);
  // }
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.refreshTokenService.remove(+id);
  // }
}
