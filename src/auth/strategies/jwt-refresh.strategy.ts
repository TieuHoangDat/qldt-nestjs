import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express'; // <-- Đảm bảo bạn đã import Request

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'refresh_token',
) {
  constructor(
    config: ConfigService,
    private prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_REFRESH_SECRET'),
      passReqToCallback: true, // Quan trọng: Để truyền request vào hàm validate
    });
  }

  async validate(request: Request, payload: any) {
    // 1. Lấy chuỗi Refresh Token từ header của request
    const refreshTokenString = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

    // 2. Tìm token trong database
    const storedToken = await this.prismaService.refreshToken.findUnique({
      where: { token: refreshTokenString },
    });

    // 3. Kiểm tra nếu token không tồn tại, đã bị thu hồi hoặc hết hạn
    if (!storedToken || storedToken.revoked) {
      throw new UnauthorizedException('Refresh token is invalid or revoked.');
    }
    if (storedToken.expiresAt < new Date()) {
      // Tùy chọn: Xóa token đã hết hạn khỏi DB để dọn dẹp
      // await this.prismaService.refreshToken.delete({ where: { id: storedToken.id } });
      throw new UnauthorizedException('Refresh token expired.');
    }

    // 4. Đính kèm chuỗi Refresh Token vào đối tượng request
    // Điều này cho phép Controller truy cập token cũ để thu hồi nó
    request.refreshTokenString = refreshTokenString; // <-- Thêm dòng này

    // 5. Trả về user data để đính kèm vào request.user
    return { userId: payload.account_id, email: payload.email, role: payload.role };
  }
}
