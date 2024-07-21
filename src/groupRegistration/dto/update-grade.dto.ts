// update-grade.dto.ts
import { IsArray, IsNumber, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class GroupRegistrationDto {
  @IsNumber()
  id: number;

  @IsNumber()
  grade: number;
}

export class UpdateGradeDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GroupRegistrationDto)
  groupRegistrations: GroupRegistrationDto[];
}
