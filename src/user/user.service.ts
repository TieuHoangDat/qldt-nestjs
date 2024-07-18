import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService){}

    async getUsers() {
        const data = await this.prismaService.account.findMany();
        
        // Map the data to exclude the password field
        const userData = data.map(({ password, ...user }) => user);
    
        return {
            status: "ok",
            message: "Query user successfully",
            data: userData
        };
    }
    

    async updateUser(userId: number, userDto: UserDto) {
        const data = await this.prismaService.account.update({
            where: {
                account_id: userId
            },
            data: {
                ...userDto
            }
        })
        return {
            status: "ok",
            message: "Update user successfully",
            data: data
        };
    }

    async deleteUserById(userId: number) {
        return this.prismaService.account.delete({
            where: {
                account_id: userId
            },
        })
    }
}