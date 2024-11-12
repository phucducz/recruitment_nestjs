import { IsNotEmpty, IsString } from 'class-validator';

export class CreateJobsPlacementDto {
  @IsString()
  @IsNotEmpty()
  placementIds: number[];

  @IsString()
  @IsNotEmpty()
  jobsId: number;
}
