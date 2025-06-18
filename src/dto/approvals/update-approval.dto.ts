import { PartialType } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { STATUS_CODE } from 'src/common/utils/enums';
import { CreateApprovalDto } from './create-approval.dto';

export class UpdateApprovalDto extends PartialType(CreateApprovalDto) {
  @IsString()
  @IsOptional()
  code?: STATUS_CODE;

  @IsString()
  @IsOptional()
  rejectReason?: string;

  @IsObject()
  @IsOptional()
  desiredJobSnapshot: Record<string, any>;
}
