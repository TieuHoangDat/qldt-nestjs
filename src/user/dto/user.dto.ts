import { IsNotEmpty, IsString, IsEmail, IsNumber, IsOptional, IsInt, Min, Max } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty({ description: 'Tên đầy đủ của người dùng', example: 'Nguyễn Thị B' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Tên đăng nhập duy nhất', example: 'nguyenthib' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ description: 'Địa chỉ email của người dùng', example: 'nguyenthib@example.com' })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Giới tính (ví dụ: "Nam", "Nữ", "Khác")', example: 'Nữ' })
    @IsString()
    @IsNotEmpty()
    gender: string;

    @ApiProperty({ description: 'Ngày sinh (số)', example: 20 })
    @IsNumber()
    @IsNotEmpty()
    @IsInt() // Đảm bảo là số nguyên
    @Min(1) @Max(31) // Ràng buộc ngày
    date: number;

    @ApiProperty({ description: 'Tháng sinh (số)', example: 10 })
    @IsNumber()
    @IsNotEmpty()
    @IsInt() // Đảm bảo là số nguyên
    @Min(1) @Max(12) // Ràng buộc tháng
    month: number;

    @ApiProperty({ description: 'Năm sinh (số)', example: 1995 })
    @IsNumber()
    @IsNotEmpty()
    @IsInt() // Đảm bảo là số nguyên
    @Min(1900) @Max(new Date().getFullYear()) // Ràng buộc năm
    year: number;

    @ApiProperty({ description: 'Vai trò của người dùng (ví dụ: 1 cho Admin, 2 cho User)', example: 2 })
    @IsNumber()
    @IsNotEmpty()
    @IsInt() // Đảm bảo là số nguyên
    @Min(1) // Giả định vai trò bắt đầu từ 1
    role: number;

    @ApiProperty({ description: 'Mã OTP (Tùy chọn)', required: false, example: '654321' })
    @IsOptional()
    @IsString()
    otp?: string;
}