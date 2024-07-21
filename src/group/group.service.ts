import { ForbiddenException, Injectable } from '@nestjs/common';
import { GroupDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GroupService {
    constructor(private prismaService: PrismaService){}


    async getGroupsByCourseId(courseId: string) {
        const data = await this.prismaService.group.findMany({
            include: {
                course: true,
                teacher: true,
                term: true,
            },
            where: {
                courseId: courseId
            },
        })
        return {
            status: "ok",
            message: "Query group successfully",
            data: data
        };
    }

    async getGroupsById(groupId: number) {
        const data = await this.prismaService.group.findUnique({
            include: {
                course: true,
            },
            where: {
                groupId: groupId
            },
        })
        return {
            status: "ok",
            message: "Query group successfully",
            data: data
        };
    }


    async insertGroup(groupDto: GroupDto) {
        const group = await this.prismaService.group.create({
            data: {
                ...groupDto
            }
        })
        return {
            status: "ok",
            message: "Create group successfully",
            data: group
        };
    }

    async updateGroup(groupId: number, groupDto: GroupDto) {
        const data = await this.prismaService.group.update({
            where: {
                groupId: groupId
            },
            data: {
                ...groupDto
            }
        })
        return {
            status: "ok",
            message: "Update group successfully",
            data: data
        };
    }

    async deleteGroupById(groupId: number) {
        const data = await this.prismaService.group.delete({
            where: {
                groupId: groupId
            },
        })
        return {
            status: "ok",
            message: "Delete group successfully",
            data: data
        };
    }
}
