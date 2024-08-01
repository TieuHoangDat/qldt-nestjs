import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationDto } from './dto';
import { Roles } from 'src/auth/guards/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationController {
    constructor(private notificationService: NotificationService) {

    }
    
    @Get()
    getNotifications() {
        const res = this.notificationService.getNotifications()
        return res
    }

    @Post()
    @Roles(1)
    insertNotification(@Body() notificationDto: NotificationDto) {
        console.log(notificationDto)
        return this.notificationService.insertNotification(notificationDto)
    }
    
    @Put(':id')
    @Roles(1)
    updateNotification(
        @Param('id', ParseIntPipe) notificationId: number,
        @Body() notificationDto: NotificationDto
    ) {
        return this.notificationService.updateNotification(notificationId, notificationDto)
    }

    @Delete(':id') 
    @Roles(1)
    deleteNotificationById(@Param('id', ParseIntPipe) notificationId: number) {
        return this.notificationService.deleteNotificationById(notificationId)
    }
}
