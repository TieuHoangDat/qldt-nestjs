import { Body, Controller, HttpException, HttpStatus, Post, Req, Get, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDTO, RegisterDto } from "./dto";
import { RefreshJwtAuthGuard } from './guards/jwt-refresh-auth.guard';

// Thêm các Decorator của Swagger
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiBody
} from '@nestjs/swagger';

@ApiTags('Auth') // Nhóm các API liên quan đến xác thực
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
        
    }

    @Post("register")
    @ApiOperation({ summary: 'Đăng ký tài khoản mới' }) // Mô tả chức năng của API
    @ApiBody({ type: RegisterDto, description: 'Dữ liệu đăng ký tài khoản mới' }) // Mô tả body của request
    @ApiResponse({
        status: 201,
        description: 'Đăng ký thành công',
        schema: {
            example: { message: "Create user successfully", data: { account_id: 1, username: "testuser", name: "Test User" } }
        }
    })
    @ApiResponse({ status: 403, description: 'Tên người dùng đã tồn tại' })
    @ApiResponse({ status: 500, description: 'Lỗi server nội bộ' })
    register(@Body() body: RegisterDto) {
        return this.authService.register(body);
    }

    @Post("login")
    @ApiOperation({ summary: 'Đăng nhập vào hệ thống' })
    @ApiBody({ type: AuthDTO, description: 'Dữ liệu đăng nhập' })
    @ApiResponse({
        status: 200,
        description: 'Đăng nhập thành công, trả về Access & Refresh Token',
        schema: {
            example: { access_token: "jwt_access_token_here", refresh_token: "jwt_refresh_token_here" }
        }
    })
    @ApiResponse({ status: 403, description: 'Tên người dùng hoặc mật khẩu không đúng' })
    @ApiResponse({ status: 500, description: 'Lỗi server nội bộ' })
    login(@Body() body: AuthDTO) {
        return this.authService.login(body);
    }

    @UseGuards(RefreshJwtAuthGuard)
    @ApiBearerAuth('refresh_token') // Đánh dấu API này yêu cầu Bearer Token (Refresh Token)
    @ApiOperation({ summary: 'Làm mới Access Token và Refresh Token' })
    @ApiResponse({
        status: 200,
        description: 'Cặp token mới được cấp.',
        schema: {
            example: { access_token: "new_jwt_access_token_here", refresh_token: "new_jwt_refresh_token_here" }
        }
    })
    @ApiResponse({ status: 400, description: 'Refresh Token không được cung cấp trong request.' })
    @ApiResponse({ status: 401, description: 'Refresh Token không hợp lệ hoặc đã hết hạn/thu hồi.' })
    @Post('refresh')
    async refresh(@Req() req) {
        const userPayload = req.user;
        const oldRefreshTokenString = req.refreshTokenString;

        if (!oldRefreshTokenString) {
            throw new HttpException('Refresh token not provided in request.', HttpStatus.BAD_REQUEST);
        }

        const newAccessToken = await this.authService.signAccessToken(userPayload);
        const newRefreshToken = await this.authService.rotateRefreshToken(oldRefreshTokenString, userPayload);

        return { access_token: newAccessToken, refresh_token: newRefreshToken };
    }

    @UseGuards(RefreshJwtAuthGuard)
    @ApiBearerAuth('refresh_token') // Đánh dấu API này yêu cầu Bearer Token (Refresh Token)
    @ApiOperation({ summary: 'Đăng xuất khỏi hệ thống' })
    @ApiResponse({ status: 200, description: 'Phiên làm việc đã bị thu hồi.' })
    @ApiResponse({ status: 400, description: 'Refresh Token không được cung cấp.' })
    @ApiResponse({ status: 401, description: 'Refresh Token không hợp lệ.' })
    @Post('logout')
    async logout(@Req() req) {
        const refreshTokenToRevoke = req.refreshTokenString;

        if (!refreshTokenToRevoke) {
            throw new HttpException('Refresh token not provided.', HttpStatus.BAD_REQUEST);
        }
        
        await this.authService.revokeRefreshToken(refreshTokenToRevoke);

        return {
            message: "Đăng xuất thành công, phiên làm việc đã bị thu hồi."
        };
    }
}