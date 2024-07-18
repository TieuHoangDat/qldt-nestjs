import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {

    }

    @Get()
    getUsers() {
        const res = this.userService.getUsers()
        return res
    }

    @Put(':id')
    updateUser(
        @Param('id', ParseIntPipe) userId: number,
        @Body() userDto: UserDto
    ) {
        return this.userService.updateUser(userId, userDto)
    }

    @Delete(':id') 
    deleteUserById(@Param('id', ParseIntPipe) userId: number) {
        return this.userService.deleteUserById(userId)
    }
}
