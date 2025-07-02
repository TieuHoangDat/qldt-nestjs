import { ForbiddenException, Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from 'argon2';
import { AuthDTO, RegisterDto } from "./dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable({})
export class AuthService{
    constructor(
        private prismaService: PrismaService, 
        private jwtService: JwtService,
        private configService: ConfigService
    ) {
    }

    async register(registerDTO: RegisterDto) {
        // hash
        const hashedPassword = await argon.hash(registerDTO.password);

        try {
            const user = await this.prismaService.account.create({
                data: {
                    username: registerDTO.username,
                    password: hashedPassword,
                    name: registerDTO.name,
                    email: registerDTO.email,
                    gender: registerDTO.gender,
                    date: registerDTO.date,
                    month: registerDTO.month,
                    year: registerDTO.year,
                    role: registerDTO.role
                },
                select: {
                    account_id: true,
                    username: true,
                    name: true,
                    email: true,
                    gender: true,
                    date: true,
                    month: true,
                    year: true,
                    role: true
                }
            })
            return {
                message: "Create user successfully",
                data: user
            };
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ForbiddenException('Username đã tồn tại');
            }
            // Ném ra lỗi chung nếu có lỗi khác
            throw new HttpException('Lỗi server nội bộ', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async login(authDTO: AuthDTO) {
        const user = await this.prismaService
            .account.findUnique({
                where: {
                    username: authDTO.username
                }
            })
        if (!user) {
            throw new ForbiddenException('User not found');
        }
        const passwordMatched = await argon.verify(
            user.password,
            authDTO.password
        )
        if (!passwordMatched) {
            throw new ForbiddenException('Incorrect password');
        }
        // Xóa password trước khi trả về hoặc sử dụng
        // delete user.password; // Tốt hơn là dùng `select` hoặc `omit` trong Prisma query
        
        // Gọi hàm tạo và lưu token
        return await this.generateAndSaveTokens(user);
    }

    // Hàm tạo Access Token
    async signAccessToken(user: any): Promise<string> {
        const payload = {
            account_id: user.account_id,
            name: user.name,
            username: user.username,
            email: user.email,
            gender: user.gender,
            date: user.date,
            month: user.month,
            year: user.year,
            role: user.role,
            otp: user.otp,
        };

        return await this.jwtService.signAsync(payload, {
            expiresIn: '15m',
            secret: this.configService.get('JWT_SECRET'),
        });
    }

    // Hàm tạo Refresh Token và lưu vào DB
    async signAndSaveRefreshToken(accountId: number): Promise<string> {
        const refreshToken = await this.jwtService.signAsync(
            { account_id: accountId },
            {
                expiresIn: '7d',
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            },
        );

        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7);

        try {
            await this.prismaService.refreshToken.create({
                data: {
                    token: refreshToken,
                    accountId: accountId,
                    expiresAt: expirationDate,
                },
            });
            return refreshToken;
        } catch (error) {
            console.error("Failed to save refresh token:", error);
            throw new HttpException('Failed to create session', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Hàm tổng hợp tạo cả Access và Refresh Token (cho login ban đầu)
    async generateAndSaveTokens(user: any): Promise<{ access_token: string; refresh_token: string }> {
        const accessToken = await this.signAccessToken(user);
        const refreshToken = await this.signAndSaveRefreshToken(user.account_id);

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }

    // Hàm xử lý luân chuyển Refresh Token
    async rotateRefreshToken(oldRefreshTokenString: string, userPayload: any): Promise<string> {
        // Thu hồi token cũ
        try {
            await this.prismaService.refreshToken.update({
                where: { token: oldRefreshTokenString },
                data: { revoked: true },
            });
        } catch (error) {
            // Nếu token cũ không tìm thấy hoặc đã bị thu hồi, vẫn tiếp tục nhưng log lỗi
            console.warn(`Failed to revoke old refresh token: ${oldRefreshTokenString}`, error);
        }

        // Tạo và lưu Refresh Token mới
        const newRefreshToken = await this.signAndSaveRefreshToken(userPayload.userId); // userId từ payload của Refresh Token

        return newRefreshToken;
    }

    // Hàm thu hồi token khi đăng xuất
    async revokeRefreshToken(token: string): Promise<void> {
        try {
            await this.prismaService.refreshToken.update({
                where: { token: token },
                data: { revoked: true },
            });
        } catch (error) {
            console.error(`Failed to revoke token ${token}:`, error);
            throw new HttpException('Failed to revoke token', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}