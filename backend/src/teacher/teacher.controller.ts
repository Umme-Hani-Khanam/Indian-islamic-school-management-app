import { Controller, Get, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TeacherService } from './teacher.service';
import { CreateMarkDto, CreateRemarkDto } from './dto/teacher.dto';

@Controller('teacher')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('TEACHER')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get('dashboard')
  getDashboard(@Request() req) {
    return this.teacherService.getDashboard(req.user);
  }

  @Get('students')
  getStudents(@Request() req) {
    return this.teacherService.getStudents(req.user);
  }

  @Get('student/:id')
  getStudentDetails(@Param('id') id: string, @Request() req) {
    return this.teacherService.getStudentDetails(req.user, id);
  }

  @Post('marks')
  addMark(@Body() dto: CreateMarkDto, @Request() req) {
    return this.teacherService.addMark(req.user, dto);
  }

  @Post('remarks')
  addRemark(@Body() dto: CreateRemarkDto, @Request() req) {
    return this.teacherService.addRemark(req.user, dto);
  }
}
