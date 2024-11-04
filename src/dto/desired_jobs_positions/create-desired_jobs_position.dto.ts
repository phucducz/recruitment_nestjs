import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateDesiredJobsPositionDto {
  @IsArray()
  @IsNotEmpty()
  jobPositionsIds: number[];

  @IsString()
  @IsNotEmpty()
  desiredJobsId: number;
}
