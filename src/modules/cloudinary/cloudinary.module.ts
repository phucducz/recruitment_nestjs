import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CloudinaryService } from 'src/services/cloudinary.service';
import { AuthModule } from '../auth/auth.module';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';
import { CloudinaryConfig } from './cloudinary.config';
import { CloudinaryController } from './cloudinary.controller';

@Module({
  imports: [TypeOrmModule.forFeature(), RefreshTokenModule, AuthModule],
  controllers: [CloudinaryController],
  providers: [CloudinaryService, CloudinaryConfig],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
