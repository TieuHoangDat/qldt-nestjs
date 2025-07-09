import { ForbiddenException, Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common'; // Thêm NotFoundException
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService){}

    async getUsers() {
        const data = await this.prismaService.account.findMany({
            // Tốt hơn là chỉ chọn các trường cần thiết để không truy xuất password từ DB
            select: {
                account_id: true,
                name: true,
                username: true,
                email: true,
                gender: true,
                date: true,
                month: true,
                year: true,
                role: true,
                otp: true,
            }
        });
        
        // Không cần map nếu đã dùng select ở trên
        // const userData = data.map(({ password, ...user }) => user);
    
        return {
            message: "Query users successfully",
            data: data
        };
    }
    

    async updateUser(userId: number, userDto: UserDto) {
        // Kiểm tra người dùng có tồn tại không trước khi cập nhật
        const existingUser = await this.prismaService.account.findUnique({
            where: { account_id: userId }
        });

        if (!existingUser) {
            throw new NotFoundException(`Không tìm thấy người dùng với ID ${userId}`);
        }

        // Kiểm tra trùng username/email nếu chúng được update và có unique constraint
        if (userDto.username && userDto.username !== existingUser.username) {
            const usernameExists = await this.prismaService.account.findUnique({
                where: { username: userDto.username }
            });
            if (usernameExists) {
                throw new HttpException('Tên người dùng đã tồn tại.', HttpStatus.CONFLICT); // HTTP 409 Conflict
            }
        }
        if (userDto.email && userDto.email !== existingUser.email) {
            const emailExists = await this.prismaService.account.findFirst({
                where: { email: userDto.email }
            });
            if (emailExists) {
                throw new HttpException('Email đã tồn tại.', HttpStatus.CONFLICT); // HTTP 409 Conflict
            }
        }


        const updatedUser = await this.prismaService.account.update({
            where: {
                account_id: userId
            },
            data: {
                ...userDto
            },
            // Chỉ trả về các trường không nhạy cảm
            select: {
                account_id: true,
                name: true,
                username: true,
                email: true,
                gender: true,
                date: true,
                month: true,
                year: true,
                role: true,
                otp: true,
            }
        })
        return {
            message: `Cập nhật người dùng với ID ${userId} thành công`,
            data: updatedUser
        };
    }

    async deleteUserById(userId: number) {
        // Kiểm tra người dùng có tồn tại không trước khi xóa
        const existingUser = await this.prismaService.account.findUnique({
            where: { account_id: userId }
        });

        if (!existingUser) {
            throw new NotFoundException(`Không tìm thấy người dùng với ID ${userId}`);
        }

        const deletedUser = await this.prismaService.account.delete({
            where: {
                account_id: userId
            },
            // Có thể chọn các trường trả về sau khi xóa nếu cần
            select: {
                account_id: true,
                username: true,
                name: true
            }
        })
        return {
            message: `Người dùng với ID ${userId} đã được xóa thành công`,
            data: deletedUser
        };
    }
}