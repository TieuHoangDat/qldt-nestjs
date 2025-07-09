import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, HttpCode, HttpStatus } from '@nestjs/common'; // Thêm HttpCode, HttpStatus
import { CourseService } from './course.service';
import { CourseDto } from './dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/roles.decorator'; // Đường dẫn đúng của decorator Roles

// Thêm các Decorator của Swagger
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiBody,
    ApiParam 
} from '@nestjs/swagger';

@ApiTags('Courses')
@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CourseController {
    constructor(private courseService: CourseService) { }

    // GET /courses (Lấy tất cả khóa học)
    @Get()
    @Roles(1)
    @ApiOperation({ summary: 'Lấy tất cả các khóa học' })
    @ApiResponse({ status: 200, description: 'Danh sách các khóa học.' })
    @ApiBearerAuth()
    getCourses() {
        return this.courseService.getCourses();
    }


    // POST /courses (Thêm khóa học mới)
    @Post()
    @Roles(1)
    @ApiOperation({ summary: 'Thêm khóa học mới' })
    @ApiBody({ type: CourseDto, description: 'Dữ liệu khóa học cần thêm' })
    @ApiResponse({ status: 201, description: 'Khóa học được tạo thành công.' })
    @ApiResponse({ status: 403, description: 'CourseId đã tồn tại.' })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.CREATED) // Trả về 201 Created
    insertCourse(@Body() courseDto: CourseDto) {
        return this.courseService.insertCourse(courseDto);
    }

    // PUT /courses/:id (Cập nhật khóa học)
    @Put(':id')
    @Roles(1)
    @ApiOperation({ summary: 'Cập nhật thông tin khóa học theo ID' })
    @ApiParam({ name: 'id', description: 'ID của khóa học', type: String })
    @ApiBody({ type: CourseDto, description: 'Dữ liệu khóa học cần cập nhật' })
    @ApiResponse({ status: 200, description: 'Khóa học được cập nhật thành công.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy khóa học.' })
    @ApiBearerAuth()
    updateCourse(
        @Param('id') courseId: string, 
        @Body() courseDto: CourseDto
    ) {
        return this.courseService.updateCourse(courseId, courseDto);
    }

    // DELETE /courses/:id (Xóa khóa học)
    @Delete(':id')
    @Roles(1)
    @ApiOperation({ summary: 'Xóa khóa học theo ID' })
    @ApiParam({ name: 'id', description: 'ID của khóa học', type: String })
    @ApiResponse({ status: 200, description: 'Khóa học được xóa thành công.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy khóa học.' })
    @ApiBearerAuth()
    deleteCourseById(@Param('id') courseId: string) { 
        return this.courseService.deleteCourseById(courseId);
    }
}