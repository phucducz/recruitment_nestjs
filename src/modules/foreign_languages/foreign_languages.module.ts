import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ForeignLanguage } from 'src/entities/foreign_language.entity';
import { ForeignLanguagesService } from '../../services/foreign_languages.service';
import { ForeignLanguagesController } from './foreign_languages.controller';
import { ForeignLanguagesRepository } from './foreign_languages.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ForeignLanguage])],
  controllers: [ForeignLanguagesController],
  providers: [ForeignLanguagesService, ForeignLanguagesRepository],
  exports: [ForeignLanguagesService],
})
export class ForeignLanguagesModule {}
