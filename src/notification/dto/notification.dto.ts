import { IsNotEmpty, IsString, MaxLength } from "class-validator"; // Thêm IsString, MaxLength
import { ApiProperty } from '@nestjs/swagger'; // Thêm ApiProperty

export class NotificationDto {
    @ApiProperty({ description: 'Tiêu đề thông báo', example: 'Thông báo lịch học' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255) // Ví dụ giới hạn độ dài
    title: string;

    @ApiProperty({ description: 'Nội dung chi tiết thông báo', example: 'Lịch học môn Toán rời rạc đã được cập nhật.' })
    @IsString()
    @IsNotEmpty()
    message: string;
}