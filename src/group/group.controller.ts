import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupDto } from './dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/roles.decorator'; // Đường dẫn đúng của decorator Roles

// Import các decorator của Swagger
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiBody,
    ApiParam
} from '@nestjs/swagger';

@ApiTags('Groups') // Gắn tag cho nhóm API này
@Controller('groups')
@UseGuards(JwtAuthGuard, RolesGuard) // Áp dụng Guard cho tất cả các endpoint trong controller
export class GroupController {
    constructor(private groupService: GroupService) { }

    // GET /groups/by-course/:id (Lấy nhóm theo Course ID)
    @Get('by-course/:id') // Đổi đường dẫn để tránh trùng lặp
    @Roles(1)
    @ApiOperation({ summary: 'Lấy tất cả các nhóm theo ID khóa học' })
    @ApiParam({ name: 'id', description: 'ID của khóa học', type: String })
    @ApiResponse({ status: 200, description: 'Danh sách các nhóm.' })
    @ApiBearerAuth()
    async getGroupsByCourseId(@Param('id') courseId: string) { // Tham số là string
        const res = await this.groupService.getGroupsByCourseId(courseId);
        return res;
    }

    // GET /groups/:id (Lấy nhóm theo Group ID)
    @Get(':id') // Đổi đường dẫn để tránh trùng lặp nếu có nhiều Get
    @Roles(1)
    @ApiOperation({ summary: 'Lấy thông tin nhóm theo Group ID' })
    @ApiParam({ name: 'id', description: 'ID của nhóm học', type: Number })
    @ApiResponse({ status: 200, description: 'Thông tin nhóm.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy nhóm.' })
    @ApiBearerAuth()
    async getGroupById(@Param('id', ParseIntPipe) groupId: number) {
        const res = await this.groupService.getGroupById(groupId);
        return res;
    }

    // POST /groups (Thêm nhóm mới)
    @Post()
    @Roles(1)
    @ApiOperation({ summary: 'Thêm nhóm học mới' })
    @ApiBody({ type: GroupDto, description: 'Dữ liệu nhóm học cần thêm' })
    @ApiResponse({ status: 201, description: 'Nhóm học được tạo thành công.' })
    @ApiResponse({ status: 409, description: 'Nhóm học đã tồn tại (nếu có logic kiểm tra trùng lặp).' })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.CREATED) // Trả về 201 Created
    async insertGroup(@Body() groupDto: GroupDto) {
        return await this.groupService.insertGroup(groupDto);
    }

    // PUT /groups/:id (Cập nhật nhóm)
    @Put(':id')
    @Roles(1)
    @ApiOperation({ summary: 'Cập nhật thông tin nhóm theo Group ID' })
    @ApiParam({ name: 'id', description: 'ID của nhóm học', type: Number })
    @ApiBody({ type: GroupDto, description: 'Dữ liệu nhóm học cần cập nhật' })
    @ApiResponse({ status: 200, description: 'Nhóm học được cập nhật thành công.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy nhóm.' })
    @ApiBearerAuth()
    async updateGroup(
        @Param('id', ParseIntPipe) groupId: number,
        @Body() groupDto: GroupDto
    ) {
        return await this.groupService.updateGroup(groupId, groupDto);
    }

    // DELETE /groups/:id (Xóa nhóm)
    @Delete(':id')
    @Roles(1)
    @ApiOperation({ summary: 'Xóa nhóm học theo Group ID' })
    @ApiParam({ name: 'id', description: 'ID của nhóm học', type: Number })
    @ApiResponse({ status: 200, description: 'Nhóm học được xóa thành công.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy nhóm.' })
    @ApiBearerAuth()
    async deleteGroupById(@Param('id', ParseIntPipe) groupId: number) {
        return await this.groupService.deleteGroupById(groupId);
    }
}