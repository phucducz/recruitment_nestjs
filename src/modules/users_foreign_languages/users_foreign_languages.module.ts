import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersForeignLanguage } from 'src/entities/users_foreign_language.entity';
import { UsersForeignLanguagesService } from '../../services/users_foreign_languages.service';
import { AuthModule } from '../auth/auth.module';
import { ForeignLanguagesModule } from '../foreign_languages/foreign_languages.module';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';
import { UsersModule } from '../users/users.module';
import { UsersForeignLanguagesRepository } from './user_foreign_languages.repository';
import { UsersForeignLanguagesController } from './users_foreign_languages.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersForeignLanguage]),
    ForeignLanguagesModule,
    UsersModule,
    RefreshTokenModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersForeignLanguagesController],
  providers: [UsersForeignLanguagesService, UsersForeignLanguagesRepository],
  exports: [UsersForeignLanguagesService],
})
export class UsersForeignLanguagesModule {}
