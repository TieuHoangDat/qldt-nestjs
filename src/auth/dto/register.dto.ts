import { IsNotEmpty, IsString, MinLength, IsEmail, IsNumber, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({
        description: 'Tên đầy đủ của người dùng',
        example: 'Nguyễn Văn A'
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Tên đăng nhập duy nhất',
        example: 'nguyenvana'
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        description: 'Mật khẩu (ít nhất 6 ký tự)',
        example: 'Password123'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    password: string;

    @ApiProperty({
        description: 'Địa chỉ email của người dùng',
        example: 'nguyenvana@example.com'
    })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Giới tính (ví dụ: "Nam", "Nữ", "Khác")',
        example: 'Nam'
    })
    @IsString()
    @IsNotEmpty()
    gender: string;

    @ApiProperty({
        description: 'Ngày sinh (số)',
        example: 15
    })
    @IsNumber()
    @IsNotEmpty()
    date: number;

    @ApiProperty({
        description: 'Tháng sinh (số)',
        example: 8
    })
    @IsNumber()
    @IsNotEmpty()
    month: number;

    @ApiProperty({
        description: 'Năm sinh (số)',
        example: 1990
    })
    @IsNumber()
    @IsNotEmpty()
    year: number;

    @ApiProperty({
        description: 'Vai trò của người dùng (ví dụ: 1 cho Admin, 2 cho User)',
        example: 2
    })
    @IsNumber()
    @IsNotEmpty()
    role: number;

    @ApiProperty({
        description: 'Mã OTP (Tùy chọn)',
        required: false,
        example: '123456'
    })
    @IsOptional()
    @IsString()
    otp?: string;
}
