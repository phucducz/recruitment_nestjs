import { IsJSON, IsOptional, IsString } from 'class-validator';
import { DesiredJob } from 'src/entities/desired_job.entity';
import { Status } from 'src/entities/status.entity';

export class CreateApprovalDto {
  @IsString()
  @IsOptional()
  rejectReason?: string;

  @IsJSON()
  @IsOptional()
  desiredJob?: DesiredJob;

  @IsJSON()
  @IsOptional()
  status?: Status;
}
