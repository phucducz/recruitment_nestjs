import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Status } from 'src/entities/status.entity';
import { CreateDesiredJobDto } from './create-desired_job.dto';

export class UpdateDesiredJobDto extends PartialType(CreateDesiredJobDto) {
  @IsString()
  @IsOptional()
  type?: 'approve' | 'reject';

  @IsString()
  @IsOptional()
  status?: Status;
}
