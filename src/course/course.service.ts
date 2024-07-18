import { ForbiddenException, Injectable } from '@nestjs/common';
import { CourseDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CourseService {
    constructor(private prismaService: PrismaService){}

    async insertCourse(courseDto: CourseDto) {
        const course1 = await this.prismaService.course.findUnique({
            where: {
                id: courseDto.id
            }
        })
        if(course1) {
            throw new ForbiddenException('CourseId đã tồn tại')
        }
        const course = await this.prismaService.course.create({
            data: {
                ...courseDto
            }
        })
        return {
            status: "ok",
            message: "Create course successfully",
            data: course
        };
    }

    async getCourses() {
        const data = await this.prismaService.course.findMany()
        return {
            status: "ok",
            message: "Query course successfully",
            data: data
        };
    }

    getCourseById(courseId: number) {
        
    }

    async updateCourse(courseId: string, courseDto: CourseDto) {
        const course = this.prismaService.course.findUnique({
            where: {
                id: courseId
            }
        })
        if(!course) {
            throw new ForbiddenException('Không tìm thấy course')
        }
        const data = await this.prismaService.course.update({
            where: {
                id: courseId
            },
            data: {
                ...courseDto
            }
        })
        return {
            status: "ok",
            message: "Update course successfully",
            data: data
        };
    }

    async deleteCourseById(courseId: string) {
        const course = this.prismaService.course.findUnique({
            where: {
                id: courseId
            }
        })
        if(!course) {
            throw new ForbiddenException('Không tìm thấy course')
        }
        return this.prismaService.course.delete({
            where: {
                id: courseId
            },
        })
    }
}
