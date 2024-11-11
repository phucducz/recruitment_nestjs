import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { rtPageInfoAndItems } from 'src/common/utils/function';
import { CreateApplicationStatusDto } from 'src/dto/application_status/create-application_status.dto';
import { UpdateApplicationStatusDto } from 'src/dto/application_status/update-application_status.dto';
import { ApplicationStatusService } from '../../services/application_status.service';

@Controller('application-status')
export class ApplicationStatusController {
  constructor(
    private readonly applicationStatusService: ApplicationStatusService,
  ) {}

  @Post()
  create(@Body() createApplicationStatusDto: CreateApplicationStatusDto) {
    return this.applicationStatusService.create(createApplicationStatusDto);
  }

  @Get('/all')
  async findAll(
    @Query() findAllQueries: IFindApplicationStatusQueries,
    @Res() res: Response,
  ) {
    const result = await this.applicationStatusService.findAll(findAllQueries);

    return res.status(200).json({
      statusCode: 200,
      ...rtPageInfoAndItems(
        { page: +findAllQueries.page, pageSize: +findAllQueries.pageSize },
        result,
      ),
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationStatusService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateApplicationStatusDto: UpdateApplicationStatusDto,
  ) {
    return this.applicationStatusService.update(
      +id,
      updateApplicationStatusDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicationStatusService.remove(+id);
  }
}
