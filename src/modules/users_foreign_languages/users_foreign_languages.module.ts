import { Module } from '@nestjs/common';
import { UsersForeignLanguagesService } from '../../services/users_foreign_languages.service';
import { UsersForeignLanguagesController } from './users_foreign_languages.controller';

@Module({
  controllers: [UsersForeignLanguagesController],
  providers: [UsersForeignLanguagesService],
})
export class UsersForeignLanguagesModule {}
