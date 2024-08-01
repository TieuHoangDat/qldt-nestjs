import { Body, Controller, HttpException, HttpStatus, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDTO, RegisterDto } from "./dto";
import { JwtService } from "@nestjs/jwt";
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

    @Post("refresh")
    async refresh(@Body() body) {
        const { refresh_token } = body;
        console.log(refresh_token)
        try {
            const payload = this.jwtService.verify(refresh_token, {
                secret: process.env.JWT_SECRET, // JWT_REFRESH_SECRET
            });

            // console.log(payload)

            const newAccessToken = this.jwtService.sign(
                {
                    account_id: payload.account_id,
                    name: payload.name,
                    username: payload.username,
                    email: payload.email,
                    gender: payload.gender,
                    date: payload.date,
                    month: payload.month,
                    year: payload.year,
                    role: payload.role,
                    otp: payload.otp
                }
                ,
                {
                    expiresIn: '15m',
                    secret: process.env.JWT_SECRET,
                },
            );

            return { access_token: newAccessToken };
        } catch (e) {
            throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
        }
    }
} 