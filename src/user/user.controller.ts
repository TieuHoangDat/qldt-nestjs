import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put, UseGuards, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/roles.decorator'; // Đảm bảo đường dẫn đúng

// Thêm các Decorator của Swagger
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiBody,
    ApiParam
} from '@nestjs/swagger';

@ApiTags('Users') // Gắn tag cho nhóm API này
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) // Áp dụng Guards cho tất cả endpoints
export class UserController {
    constructor(private userService: UserService) {}

    // GET /users (Lấy tất cả người dùng)
    @Get()
    @Roles(1) // Giả định chỉ Admin (role 1) mới có quyền xem danh sách người dùng
    @ApiOperation({ summary: 'Lấy tất cả thông tin người dùng' })
    @ApiResponse({ status: 200, description: 'Danh sách người dùng thành công.' })
    @ApiResponse({ status: 401, description: 'Không xác thực.' })
    @ApiResponse({ status: 403, description: 'Không có quyền truy cập.' })
    @ApiBearerAuth() // Yêu cầu Bearer Token
    async getUsers() { // Thêm async/await
        return await this.userService.getUsers();
    }

    // PUT /users/:id (Cập nhật thông tin người dùng)
    @Put(':id')
    @Roles(1) // Chỉ Admin có quyền cập nhật người dùng khác
    @ApiOperation({ summary: 'Cập nhật thông tin người dùng theo ID' })
    @ApiParam({ name: 'id', description: 'ID của người dùng', type: Number })
    @ApiBody({ type: UserDto, description: 'Dữ liệu người dùng cần cập nhật' })
    @ApiResponse({ status: 200, description: 'Cập nhật người dùng thành công.' })
    @ApiResponse({ status: 401, description: 'Không xác thực.' })
    @ApiResponse({ status: 403, description: 'Không có quyền truy cập.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng.' })
    @ApiBearerAuth()
    async updateUser( // Thêm async/await
        @Param('id', ParseIntPipe) userId: number,
        @Body() userDto: UserDto
    ) {
        return await this.userService.updateUser(userId, userDto);
    }

    // DELETE /users/:id (Xóa người dùng)
    @Delete(':id')
    @Roles(1) // Chỉ Admin có quyền xóa người dùng
    @ApiOperation({ summary: 'Xóa người dùng theo ID' })
    @ApiParam({ name: 'id', description: 'ID của người dùng', type: Number })
    @ApiResponse({ status: 200, description: 'Xóa người dùng thành công.' })
    @ApiResponse({ status: 401, description: 'Không xác thực.' })
    @ApiResponse({ status: 403, description: 'Không có quyền truy cập.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng.' })
    @ApiBearerAuth()
    async deleteUserById(@Param('id', ParseIntPipe) userId: number) { // Thêm async/await
        return await this.userService.deleteUserById(userId);
    }
}