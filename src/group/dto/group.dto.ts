import { IsNotEmpty, IsString, IsNumber, IsOptional, Max, Min } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class GroupDto {
    @ApiProperty({ description: 'Tên nhóm học (ví dụ: Nhóm 1, Lập trình C++ buổi sáng)', example: 'Nhóm 1' })
    @IsString()
    @IsNotEmpty()
    groupName: string;

    @ApiProperty({ description: 'Mã khóa học mà nhóm này thuộc về', example: 'CS101' })
    @IsString()
    @IsNotEmpty()
    courseId: string;

    @ApiProperty({ description: 'Thứ trong tuần (1: Chủ Nhật, 2: Thứ 2, ..., 7: Thứ 7)', example: 2 })
    @IsNumber()
    @IsNotEmpty()
    @Min(1) @Max(7)
    dayOfWeek: number;

    @ApiProperty({ description: 'Tiết học (ví dụ: 1 cho tiết 1-3, 2 cho tiết 4-6)', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    period: number;

    @ApiProperty({ description: 'ID của giáo viên phụ trách nhóm', example: 123 })
    @IsNumber()
    @IsNotEmpty()
    teacherId: number;

    @ApiProperty({ description: 'Phòng học', example: 'A201' })
    @IsString()
    @IsNotEmpty()
    room: string;

    @ApiProperty({ description: 'Số lượng sinh viên tối đa cho nhóm', example: 50 })
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    maxStudents: number;

    @ApiProperty({ description: 'Số chỗ trống hiện có', required: false, example: 50 })
    @IsNumber()
    @IsOptional()
    @Min(0)
    availableSlots: number;

    @ApiProperty({ description: 'ID của học kỳ', example: 20241 })
    @IsNumber()
    @IsNotEmpty()
    termId: number;
}