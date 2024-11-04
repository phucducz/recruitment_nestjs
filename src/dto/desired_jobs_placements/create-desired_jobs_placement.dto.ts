import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDesiredJobsPlacementDto {
  @IsString()
  @IsNotEmpty()
  jobPlacementsId: string;

  @IsString()
  @IsNotEmpty()
  jobsId: string;
}
