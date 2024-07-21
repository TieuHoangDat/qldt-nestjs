import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupDto } from './dto';

@Controller('groups')
export class GroupController {
    constructor(private groupService: GroupService) {

    }
    
    @Get('courseId/:id')
    getGroups(@Param('id') courseId: string) {
        const res = this.groupService.getGroupsByCourseId(courseId)
        return res
    }

    @Get('getGroup/:id')
    getGroupById(@Param('id', ParseIntPipe) groupId: number) {
        const res = this.groupService.getGroupsById(groupId)
        return res
    }

    @Post()
    insertGroup(@Body() groupDto: GroupDto) {
        console.log(groupDto)
        return this.groupService.insertGroup(groupDto)
    }

    @Put(':id')
    updateGroup(
        @Param('id', ParseIntPipe) groupId: number,
        @Body() groupDto: GroupDto
    ) {
        return this.groupService.updateGroup(groupId, groupDto)
    }

    @Delete(':id') 
    deleteGroupById(@Param('id', ParseIntPipe) groupId: number) {
        return this.groupService.deleteGroupById(groupId)
    }
}
