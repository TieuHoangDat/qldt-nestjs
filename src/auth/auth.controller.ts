import { Body, Controller, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDTO, RegisterDto } from "./dto";
@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService){

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
} 