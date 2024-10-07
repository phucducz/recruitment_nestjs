import { Module } from '@nestjs/common';

import { CloudinaryService } from 'src/services/cloudinary.service';
import { AuthModule } from '../auth/auth.module';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';
import { CloudinaryController } from './cloudinary.controller';

@Module({
  imports: [RefreshTokenModule, AuthModule],
  controllers: [CloudinaryController],
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
