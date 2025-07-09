import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class AuthDTO {
    @ApiProperty({
        description: 'Tên người dùng duy nhất để đăng nhập',
        example: 'nguyenvana'
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        description: 'Mật khẩu của người dùng (ít nhất 6 ký tự)',
        example: 'Password123'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    password: string;
}