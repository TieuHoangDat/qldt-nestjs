import { Body, Controller, HttpException, HttpStatus, Post, Req, Get, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDTO, RegisterDto } from "./dto";
import { JwtService } from "@nestjs/jwt";
import { RefreshJwtAuthGuard } from './guards/jwt-refresh-auth.guard'; 
@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService, private jwtService: JwtService){
        
    }

    @Post("register")
    register(@Body() body:RegisterDto) {
        // console.log(body)
        return this.authService.register(body)
    }

    @Post("login")
    login(@Body() body:AuthDTO) {
        return this.authService.login(body)
    }

    @UseGuards(RefreshJwtAuthGuard)
    @Post('refresh') // Thay đổi thành POST
    async refresh(@Req() req) {
        // Thông tin user đã được đính kèm vào request.user nhờ Guard
        const userPayload = req.user; // Payload từ Refresh Token
        const oldRefreshTokenString = req.refreshTokenString; // Chuỗi token cũ từ Request

        if (!oldRefreshTokenString) {
            throw new HttpException('Refresh token not provided in request.', HttpStatus.BAD_REQUEST);
        }

        // Tạo Access Token mới
        const newAccessToken = await this.authService.signAccessToken(userPayload);

        // // Luân chuyển Refresh Token (thu hồi cũ, tạo mới)
        const newRefreshToken = await this.authService.rotateRefreshToken(oldRefreshTokenString, userPayload);

        return { access_token: newAccessToken, refresh_token: newRefreshToken };
    }


    @UseGuards(RefreshJwtAuthGuard)
    @Post('logout')
    async logout(@Req() req) {
        // RefreshJwtAuthGuard đã xác minh token và đính kèm nó vào request
        const refreshTokenToRevoke = req.refreshTokenString;

        if (!refreshTokenToRevoke) {
            // Trường hợp này không nên xảy ra nếu guard hoạt động đúng,
            // nhưng nên có để đảm bảo an toàn.
            throw new HttpException('Refresh token not provided.', HttpStatus.BAD_REQUEST);
        }
        
        // Thu hồi token bằng cách cập nhật trạng thái trong DB
        await this.authService.revokeRefreshToken(refreshTokenToRevoke);

        return {
            message: "Đăng xuất thành công, phiên làm việc đã bị thu hồi."
        };
    }
} 