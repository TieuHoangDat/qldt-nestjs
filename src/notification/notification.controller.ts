import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationDto } from './dto';
import { Roles } from 'src/auth/guards/roles.decorator'; 
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiBody,
    ApiParam
} from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard) 
export class NotificationController {
    constructor(private notificationService: NotificationService) {}

    // GET /notifications (Lấy tất cả thông báo)
    @Get()
    @ApiOperation({ summary: 'Lấy tất cả các thông báo' })
    @ApiResponse({ status: 200, description: 'Danh sách thông báo thành công.' })
    @ApiBearerAuth() // Yêu cầu Bearer Token

    async getNotifications() {
        return await this.notificationService.getNotifications();
    }


    @Post()
    @Roles(1)
    @ApiOperation({ summary: 'Tạo thông báo mới' })
    @ApiBody({ type: NotificationDto, description: 'Dữ liệu thông báo cần tạo' })
    @ApiResponse({ status: 201, description: 'Thông báo được tạo thành công.' })
    @ApiResponse({ status: 401, description: 'Không xác thực.' })
    @ApiResponse({ status: 403, description: 'Không có quyền truy cập.' })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.CREATED) // Trả về 201 Created cho POST
    async insertNotification(@Body() notificationDto: NotificationDto) { 
        return await this.notificationService.insertNotification(notificationDto);
    }
    
    @Put(':id')
    @Roles(1) // Chỉ Admin (role 1) mới có quyền cập nhật thông báo
    @ApiOperation({ summary: 'Cập nhật thông báo theo ID' })
    @ApiParam({ name: 'id', description: 'ID của thông báo', type: Number })
    @ApiBody({ type: NotificationDto, description: 'Dữ liệu thông báo cần cập nhật' })
    @ApiResponse({ status: 200, description: 'Thông báo được cập nhật thành công.' })
    @ApiResponse({ status: 401, description: 'Không xác thực.' })
    @ApiResponse({ status: 403, description: 'Không có quyền truy cập.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy thông báo.' })
    @ApiBearerAuth()
    async updateNotification(
        @Param('id', ParseIntPipe) notificationId: number,
        @Body() notificationDto: NotificationDto
    ) {
        return await this.notificationService.updateNotification(notificationId, notificationDto);
    }

    @Delete(':id') 
    @Roles(1) // Chỉ Admin (role 1) mới có quyền xóa thông báo
    @ApiOperation({ summary: 'Xóa thông báo theo ID' })
    @ApiParam({ name: 'id', description: 'ID của thông báo', type: Number })
    @ApiResponse({ status: 200, description: 'Thông báo được xóa thành công.' })
    @ApiResponse({ status: 401, description: 'Không xác thực.' })
    @ApiResponse({ status: 403, description: 'Không có quyền truy cập.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy thông báo.' })
    @ApiBearerAuth()
    async deleteNotificationById(@Param('id', ParseIntPipe) notificationId: number) { 
        return await this.notificationService.deleteNotificationById(notificationId);
    }
}
