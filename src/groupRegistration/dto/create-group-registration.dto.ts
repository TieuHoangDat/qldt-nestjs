import { IsNotEmpty, IsNumber, IsInt, Min } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupRegistrationDto {
    @ApiProperty({ description: 'ID của người dùng đăng ký', example: 101 })
    @IsNumber()
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    userId: number;

    @ApiProperty({ description: 'ID của nhóm học được đăng ký', example: 201 })
    @IsNumber()
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    groupId: number;
}