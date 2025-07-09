import { IsNotEmpty, IsString, IsNumber, IsOptional } from "class-validator"; // Thêm IsString, IsNumber, IsOptional
import { ApiProperty } from '@nestjs/swagger'; // Thêm ApiProperty

export class CourseDto {
    @ApiProperty({ description: 'Mã khóa học (duy nhất)', example: 'CS101' })
    @IsNotEmpty()
    @IsString() // id thường là string trong trường hợp này
    id: string;

    @ApiProperty({ description: 'Tên khóa học', example: 'Giới thiệu lập trình' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: 'Số tín chỉ', example: 3 })
    @IsNotEmpty()
    @IsNumber()
    num_credit: number;

    @ApiProperty({ description: 'Học kỳ', example: 1 })
    @IsNotEmpty()
    @IsNumber()
    term: number;

    @ApiProperty({ description: 'Trạng thái không tính điểm (tùy chọn)', required: false, example: 0 })
    @IsOptional()
    @IsNumber()
    notcal?: number;
}