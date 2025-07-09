import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, HttpCode, HttpStatus, NotFoundException, ConflictException } from '@nestjs/common';
import { GroupRegistrationService } from './groupRegistration.service';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { CreateGroupRegistrationDto } from './dto/create-group-registration.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

// Import các Decorator của Swagger
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiBody,
    ApiParam
} from '@nestjs/swagger';

@ApiTags('Group Registrations') // Tag cho nhóm API này
@Controller('group-registrations') // Đổi tên controller path cho rõ ràng hơn
@UseGuards(JwtAuthGuard, RolesGuard) // Áp dụng Guards cho tất cả endpoints
export class GroupRegistrationController {
    constructor(private groupRegistrationService: GroupRegistrationService) { }

    // GET /group-registrations/user/:userId/grades (Lấy điểm của sinh viên)
    @Get('user/:userId/grades') // Đường dẫn rõ ràng hơn
    @ApiOperation({ summary: 'Lấy tất cả các bản ghi đăng ký nhóm học và điểm theo ID người dùng' })
    @ApiParam({ name: 'userId', description: 'ID của người dùng', type: Number })
    @ApiResponse({ status: 200, description: 'Danh sách các bản ghi đăng ký nhóm học và điểm.' })
    @ApiBearerAuth()
    async getGroupRegistrations(@Param('userId', ParseIntPipe) userId: number) {
        // Có thể thêm logic kiểm tra userPayload.userId == userId nếu user xem điểm của chính mình
        return await this.groupRegistrationService.getGroupRegistrationsByUserId(userId);
    }

    // GET /group-registrations/user/:userId/time-table (Lấy thời khóa biểu của sinh viên)
    @Get('user/:userId/time-table') // Đường dẫn rõ ràng hơn
    @ApiOperation({ summary: 'Lấy thời khóa biểu của người dùng theo ID' })
    @ApiParam({ name: 'userId', description: 'ID của người dùng', type: Number })
    @ApiResponse({ status: 200, description: 'Thời khóa biểu của người dùng.' })
    @ApiBearerAuth()
    async getTimeTable(@Param('userId', ParseIntPipe) userId: number) {
        return await this.groupRegistrationService.timeTable(userId);
    }

    // GET /group-registrations/group/:groupId/students (Lấy danh sách sinh viên trong nhóm)
    @Get('group/:groupId/students') // Đường dẫn rõ ràng hơn
    @ApiOperation({ summary: 'Lấy danh sách sinh viên đã đăng ký trong một nhóm học' })
    @ApiParam({ name: 'groupId', description: 'ID của nhóm học', type: Number })
    @ApiResponse({ status: 200, description: 'Danh sách sinh viên.' })
    @ApiBearerAuth()
    async getListStudent(@Param('groupId', ParseIntPipe) groupId: number) {
        return await this.groupRegistrationService.getListStudent(groupId);
    }

    // GET /group-registrations/group/:groupId (Lấy bản ghi đăng ký theo Group ID - ít phổ biến hơn?)
    // Đổi tên endpoint để tránh trùng với getGroupById nếu có trong groupController
    @Get('group/:groupId/registrations') // Đường dẫn rõ ràng hơn
    @ApiOperation({ summary: 'Lấy tất cả các bản ghi đăng ký cho một nhóm học cụ thể' })
    @ApiParam({ name: 'groupId', description: 'ID của nhóm học', type: Number })
    @ApiResponse({ status: 200, description: 'Danh sách bản ghi đăng ký.' })
    @ApiBearerAuth()
    async getGRByGroupId(@Param('groupId', ParseIntPipe) groupId: number) {
        return await this.groupRegistrationService.getGRByGroupId(groupId);
    }

    // POST /group-registrations/grades (Cập nhật điểm)
    @Post('grades') // Endpoint riêng cho việc cập nhật điểm
    @ApiOperation({ summary: 'Cập nhật điểm cho nhiều bản ghi đăng ký nhóm học' })
    @ApiBody({ type: UpdateGradeDto, description: 'Danh sách các bản ghi đăng ký và điểm cần cập nhật' })
    @ApiResponse({ status: 200, description: 'Cập nhật điểm thành công.' })
    @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy một số bản ghi.' })
    @ApiBearerAuth()
    async updateGrades(@Body() updateGradeDto: UpdateGradeDto) {
        const { groupRegistrations } = updateGradeDto;
        return await this.groupRegistrationService.updateGrades(groupRegistrations);
    }

    // --- Các endpoint liên quan đến Đăng ký Tín chỉ (CourseRegistration) ---
    // Lưu ý: Tên biến `getCR` và `getGR` khá khó hiểu, nên đổi tên rõ ràng hơn

    // GET /group-registrations/user/:userId/course-registrations (Lấy đăng ký tín chỉ của user)
    @Get('user/:userId/course-registrations')
    @ApiOperation({ summary: 'Lấy tất cả các đăng ký tín chỉ của người dùng' })
    @ApiParam({ name: 'userId', description: 'ID của người dùng', type: Number })
    @ApiResponse({ status: 200, description: 'Danh sách đăng ký tín chỉ.' })
    @ApiBearerAuth()
    async getCRByUserId(@Param('userId', ParseIntPipe) userId: number) {
        return await this.groupRegistrationService.getCRByUserId(userId);
    }

    // GET /group-registrations/user/:userId/group-registrations (Lấy đăng ký nhóm của user)
    @Get('user/:userId/group-registrations') // Endpoint này trùng với show_grade nếu getGRByUserId cũng trả về điểm
    @ApiOperation({ summary: 'Lấy tất cả các đăng ký nhóm học của người dùng' })
    @ApiParam({ name: 'userId', description: 'ID của người dùng', type: Number })
    @ApiResponse({ status: 200, description: 'Danh sách đăng ký nhóm học.' })
    @ApiBearerAuth()
    async getGRByUserId(@Param('userId', ParseIntPipe) userId: number) {
        return await this.groupRegistrationService.getGRByUserId(userId);
    }

    // GET /group-registrations/user/:userId/groups (Lấy các nhóm đã đăng ký của user)
    @Get('user/:userId/groups')
    @ApiOperation({ summary: 'Lấy thông tin các nhóm học mà người dùng đã đăng ký' })
    @ApiParam({ name: 'userId', description: 'ID của người dùng', type: Number })
    @ApiResponse({ status: 200, description: 'Danh sách các nhóm học đã đăng ký.' })
    @ApiBearerAuth()
    async getGroupInCRByUserId(@Param('userId', ParseIntPipe) userId: number) {
        return await this.groupRegistrationService.getGroupInCRByUserId(userId);
    }

    // GET /group-registrations/user/:userId/groups/:courseId (Lấy nhóm đã đăng ký của user theo khóa học)
    @Get('user/:userId/groups/:courseId')
    @ApiOperation({ summary: 'Lấy thông tin nhóm học mà người dùng đã đăng ký theo ID khóa học' })
    @ApiParam({ name: 'userId', description: 'ID của người dùng', type: Number })
    @ApiParam({ name: 'courseId', description: 'ID của khóa học', type: String }) // courseId là string
    @ApiResponse({ status: 200, description: 'Danh sách nhóm học đã đăng ký theo khóa học.' })
    @ApiBearerAuth()
    async getGroupInCRByUserIdAndCourseId(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('courseId') courseId: string) {
        return await this.groupRegistrationService.getGroupInCRByUserIdAndCourseId(userId, courseId);
    }

    // POST /group-registrations (Đăng ký nhóm học mới)
    @Post() // Đường dẫn này trùng với /group-registrations/grades nếu không có đường dẫn rõ ràng
    @ApiOperation({ summary: 'Đăng ký một người dùng vào một nhóm học' })
    @ApiBody({ type: CreateGroupRegistrationDto, description: 'Dữ liệu đăng ký nhóm học' })
    @ApiResponse({ status: 201, description: 'Đăng ký nhóm học thành công.' })
    @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ.' })
    @ApiResponse({ status: 409, description: 'Người dùng đã đăng ký nhóm này hoặc nhóm đã đầy.' })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.CREATED)
    async createGroupRegistration(@Body() createGroupRegistrationDto: CreateGroupRegistrationDto) {
        return await this.groupRegistrationService.create(createGroupRegistrationDto);
    }

    // DELETE /group-registrations/:id (Xóa đăng ký nhóm học)
    @Delete(':id')
    @ApiOperation({ summary: 'Xóa một bản ghi đăng ký nhóm học theo ID' })
    @ApiParam({ name: 'id', description: 'ID của bản ghi đăng ký nhóm học', type: Number })
    @ApiResponse({ status: 200, description: 'Bản ghi đăng ký nhóm học đã bị xóa.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy bản ghi đăng ký.' })
    @ApiBearerAuth()
    async deleteGrById(@Param('id', ParseIntPipe) grId: number) {
        return await this.groupRegistrationService.deleteGRById(grId);
    }
}
