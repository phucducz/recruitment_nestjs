import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateWorkExperienceDto {
    @IsString()
    @IsNotEmpty()
    companyName: string;

    @IsNumber()
    @IsNotEmpty()
    positionId: number;

    @IsNumber()
    @IsNotEmpty()
    jobCategoriessId: number;

    @IsString()
    @IsNotEmpty()
    startDate: string;

    @IsString()
    @IsOptional()
    endDate: string;

    @IsNumber()
    @IsOptional()
    placementsId: number;

    @IsString()
    @IsOptional()
    description: string;
}
