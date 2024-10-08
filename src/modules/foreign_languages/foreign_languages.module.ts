import { Module } from '@nestjs/common';
import { ForeignLanguagesService } from '../../services/foreign_languages.service';
import { ForeignLanguagesController } from './foreign_languages.controller';

@Module({
  controllers: [ForeignLanguagesController],
  providers: [ForeignLanguagesService],
})
export class ForeignLanguagesModule {}
