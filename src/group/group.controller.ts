import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupDto } from './dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/roles.decorator';

@Controller('groups')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GroupController {
    constructor(private groupService: GroupService) {

    }
    
    @Get('courseId/:id')
    @Roles(1)
    getGroups(@Param('id') courseId: string) {
        const res = this.groupService.getGroupsByCourseId(courseId)
        return res
    }

    @Get('getGroup/:id')
    @Roles(1)
    getGroupById(@Param('id', ParseIntPipe) groupId: number) {
        const res = this.groupService.getGroupsById(groupId)
        return res
    }

    @Post()
    @Roles(1)
    insertGroup(@Body() groupDto: GroupDto) {
        console.log(groupDto)
        return this.groupService.insertGroup(groupDto)
    }

    @Put(':id')
    @Roles(1)
    updateGroup(
        @Param('id', ParseIntPipe) groupId: number,
        @Body() groupDto: GroupDto
    ) {
        return this.groupService.updateGroup(groupId, groupDto)
    }

    @Delete(':id') 
    @Roles(1)
    deleteGroupById(@Param('id', ParseIntPipe) groupId: number) {
        return this.groupService.deleteGroupById(groupId)
    }
}
