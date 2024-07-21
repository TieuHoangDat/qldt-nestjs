import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { GroupRegistrationService } from './groupRegistration.service';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { CreateGroupRegistrationDto } from './dto/create-group-registration.dto';
// import { GroupRegistrationDto } from './dto';

@Controller()
export class GroupRegistrationController {
    constructor(private groupRegistrationService: GroupRegistrationService) {

    }
    
    @Get('show_grade/:id')
    getGroupRegistrations(@Param('id', ParseIntPipe) userId: number) {
        const res = this.groupRegistrationService.getGroupRegistrationsByUserId(userId)
        return res
    }

    @Get('time_table/:id')
    getTimeTable(@Param('id', ParseIntPipe) userId: number) {
        const res = this.groupRegistrationService.timeTable(userId)
        return res
    }

    @Get('getListStudent/:id')
    getListStudent(@Param('id', ParseIntPipe) groupId: number) {
        const res = this.groupRegistrationService.getListStudent(groupId)
        return res
    }

    @Get('groupRegistrationByGroupId/:id')
    getGRByGroupId(@Param('id', ParseIntPipe) groupId: number) {
        const res = this.groupRegistrationService.getGRByGroupId(groupId)
        return res
    }

    @Post('addGrade')
    async updateGrades(@Body() updateGradeDto: UpdateGradeDto) {
        const { groupRegistrations } = updateGradeDto;
        return this.groupRegistrationService.updateGrades(groupRegistrations);
    }

    // Đăng kí tín chỉ

    @Get('courseRegistration/:id')
    getCR(@Param('id', ParseIntPipe) userId: number) {
        const res = this.groupRegistrationService.getCRByUserId(userId)
        return res
    }

    @Get('groupRegistration/:id')
    getGR(@Param('id', ParseIntPipe) userId: number) {
        const res = this.groupRegistrationService.getGRByUserId(userId)
        return res
    }

    @Get('/groupRegistration/groups/:id')
    getGroup(@Param('id', ParseIntPipe) userId: number) {
        const res = this.groupRegistrationService.getGroupInCRByUserId(userId)
        return res
    }

    @Get('/groupRegistration/groups/:id/:courseId')
    getGroupByUserIdAndCourseId(
        @Param('id', ParseIntPipe) userId: number,
        @Param('courseId') courseId: string) {
        const res = this.groupRegistrationService.getGroupInCRByUserIdAndCourseId(userId, courseId)
        return res
    }

    @Post('/groupRegistration/add')
    async createGroupRegistration(@Body() createGroupRegistrationDto: CreateGroupRegistrationDto) {
        return this.groupRegistrationService.create(createGroupRegistrationDto);
    }

    @Delete('groupRegistration/:id') 
    deleteGrById(@Param('id', ParseIntPipe) grId: number) {
        return this.groupRegistrationService.deleteGRById(grId)
    }
}
