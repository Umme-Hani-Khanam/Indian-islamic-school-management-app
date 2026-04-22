import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { FilterAttendanceDto } from './dto/filter-attendance.dto';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post()
  @Roles('HEADMASTER', 'TEACHER')
  async create(@Body() body: CreateAttendanceDto, @Req() req: any) {
    return this.attendanceService.create(body, req.user);
  }

  @Get('student/:id')
  @Roles('HEADMASTER', 'TEACHER', 'PARENT')
  async getStudentAttendance(@Param('id') id: string, @Query() query: FilterAttendanceDto, @Req() req: any) {
    return this.attendanceService.getStudentAttendance(id, query, req.user);
  }

  @Get('class/:classId')
  @Roles('HEADMASTER', 'TEACHER')
  async getClassAttendance(@Param('classId') classId: string, @Query() query: FilterAttendanceDto, @Req() req: any) {
    return this.attendanceService.getClassAttendance(classId, query, req.user);
  }
}
