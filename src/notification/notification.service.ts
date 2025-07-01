import { ForbiddenException, Injectable } from '@nestjs/common';
import { NotificationDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationService {
    constructor(private prismaService: PrismaService){}

    async insertNotification(notificationDto: NotificationDto) {
        const notification = await this.prismaService.notification.create({
            data: {
                ...notificationDto
            }
        })
        return {
            message: "Create notification successfully",
            data: notification
        };
    }

    async getNotifications() {
        const data = await this.prismaService.notification.findMany()
        return {
            message: "Query notification successfully",
            data: data
        };
    }

    async updateNotification(notificationId: number, notificationDto: NotificationDto) {
        const data = await this.prismaService.notification.update({
            where: {
                id: notificationId
            },
            data: {
                ...notificationDto
            }
        })
        return {
            message: "Update notification successfully",
            data: data
        };
    }

    async deleteNotificationById(notificationId: number) {
        const data = await this.prismaService.notification.delete({
            where: {
                id: notificationId
            },
        })
        return {
            message: "Delete notification successfully",
            data: data
        };
    }
}
