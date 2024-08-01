import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
    constructor(private userService: UserService) {

    }

    @Get()
    @Roles(1)
    getUsers() {
        const res = this.userService.getUsers()
        return res
    }

    @Put(':id')
    @Roles(1)
    updateUser(
        @Param('id', ParseIntPipe) userId: number,
        @Body() userDto: UserDto
    ) {
        return this.userService.updateUser(userId, userDto)
    }

    @Delete(':id') 
    @Roles(1)
    deleteUserById(@Param('id', ParseIntPipe) userId: number) {
        return this.userService.deleteUserById(userId)
    }
}
