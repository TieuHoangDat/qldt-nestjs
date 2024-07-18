import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseDto } from './dto';

@Controller('courses')
export class CourseController {
    constructor(private courseService: CourseService) {

    }
    
    @Get()
    getCourses() {
        const res = this.courseService.getCourses()
        return res
    }

    @Get()
    getCourseById(@Param('id', ParseIntPipe) courseId: number) {
        return this.courseService.getCourseById(courseId)
    }

    @Post()
    insertCourse(@Body() courseDto: CourseDto) {
        console.log(courseDto)
        return this.courseService.insertCourse(courseDto)
    }

    @Put(':id')
    updateCourse(
        @Param('id') courseId: string,
        @Body() courseDto: CourseDto
    ) {
        return this.courseService.updateCourse(courseId, courseDto)
    }

    @Delete(':id') 
    deleteCourseById(@Param('id') courseId: string) {
        return this.courseService.deleteCourseById(courseId)
    }
    
}
