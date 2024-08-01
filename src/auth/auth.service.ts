import { ForbiddenException, Injectable } from "@nestjs/common";
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
                status: "ok",
                message: "Create user successfully",
                data: user
            };
        } catch (error) {
            if(error.code == 'P2002') {
                // throw new ForbiddenException(error.message)
                throw new ForbiddenException('Username đã tồn tại')
            }
            return {
                error
            }
        }
    }

    async login(authDTO: AuthDTO) {
        const user = await this.prismaService
                            .account.findUnique({
                                where: {
                                    username:authDTO.username
                                }
                            })
        if(!user) {
            throw new ForbiddenException('User not found')
        }
        const passwordMatched = await argon.verify(
            user.password,
            authDTO.password
        )
        if(!passwordMatched) {
            throw new ForbiddenException('Incorrect password')
        }
        delete user.password
        return await this.signJwtToken(user)
    }

    async signJwtToken(user: any): Promise<{status: string, message: string, access_token: string, refresh_token: string}> {
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
            otp: user.otp
        };

        const access_token = await this.jwtService.signAsync(payload, {
            expiresIn: '1m',
            secret: this.configService.get('JWT_SECRET'),
        });
    
        const refresh_token = await this.jwtService.signAsync(payload, {
            expiresIn: '7d',
            secret: this.configService.get('JWT_SECRET'), //JWT_REFRESH_SECRET
        });
    
        return {
            status: "ok",
            message: "Đăng nhập thành công",
            access_token,
            refresh_token,
        };
    }
}
