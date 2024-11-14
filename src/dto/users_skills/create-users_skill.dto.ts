import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUsersSkillDto {
  @IsNumber()
  @IsNotEmpty()
  skillsId: number;

  @IsNumber()
  @IsNotEmpty()
  level: number;
}
