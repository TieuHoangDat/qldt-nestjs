import { IsNumber, IsNotEmpty, IsInt, IsOptional, Min, Max, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GroupRegistrationDto {
  @ApiProperty({ description: 'ID của bản ghi đăng ký nhóm học (GroupRegistration)', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({ description: 'Điểm số của sinh viên cho nhóm học này', example: 85.5 })
  @IsNumber()
  @IsOptional() // Điểm có thể là null nếu chưa có
  @Min(0) @Max(10) // Giả định điểm từ 0-100
  grade: number;
}

export class UpdateGradeDto {
  @ApiProperty({ type: [GroupRegistrationDto], description: 'Danh sách các bản ghi đăng ký nhóm học với điểm số cần cập nhật' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GroupRegistrationDto)
  groupRegistrations: GroupRegistrationDto[];
}
