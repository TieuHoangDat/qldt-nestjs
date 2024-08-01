import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseDto } from './dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/roles.decorator';

@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CourseController {
    constructor(private courseService: CourseService) {

    }
    
    @Get()
    @Roles(1)
    getCourses() {
        const res = this.courseService.getCourses()
        return res
    }

    @Get()
    @Roles(1)
    getCourseById(@Param('id', ParseIntPipe) courseId: number) {
        return this.courseService.getCourseById(courseId)
    }

    @Post()
    @Roles(1)
    insertCourse(@Body() courseDto: CourseDto) {
        console.log(courseDto)
        return this.courseService.insertCourse(courseDto)
    }

    @Put(':id')
    @Roles(1)
    updateCourse(
        @Param('id') courseId: string,
        @Body() courseDto: CourseDto
    ) {
        return this.courseService.updateCourse(courseId, courseDto)
    }

    @Delete(':id') 
    @Roles(1)
    deleteCourseById(@Param('id') courseId: string) {
        return this.courseService.deleteCourseById(courseId)
    }
    
}
