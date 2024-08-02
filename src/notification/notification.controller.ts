import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationDto } from './dto';

@Controller('notifications')
export class NotificationController {
    constructor(private notificationService: NotificationService) {

    }
    
    @Get()
    getNotifications() {
        const res = this.notificationService.getNotifications()
        return res
    }

    @Post()
    insertNotification(@Body() notificationDto: NotificationDto) {
        console.log(notificationDto)
        return this.notificationService.insertNotification(notificationDto)
    }
    
    @Put(':id')
    updateNotification(
        @Param('id', ParseIntPipe) notificationId: number,
        @Body() notificationDto: NotificationDto
    ) {
        return this.notificationService.updateNotification(notificationId, notificationDto)
    }

    @Delete(':id') 
    deleteNotificationById(@Param('id', ParseIntPipe) notificationId: number) {
        return this.notificationService.deleteNotificationById(notificationId)
    }
}
