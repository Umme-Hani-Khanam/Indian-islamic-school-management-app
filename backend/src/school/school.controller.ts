import { Controller, Get, Param, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { SchoolService } from './school.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('school')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Get('classes')
  @Roles('HEADMASTER', 'TEACHER')
  getClasses(@Request() req) {
    return this.schoolService.getClasses(req.user);
  }

  @Get('classes/:id/students')
  @Roles('HEADMASTER', 'TEACHER', 'PARENT')
  getStudents(@Param('id') id: string, @Request() req) {
    return this.schoolService.getStudents(id, req.user);
  }

  @Get('students/:id/profile')
  @Roles('HEADMASTER', 'TEACHER', 'PARENT')
  getStudentProfile(@Param('id') id: string, @Request() req) {
    try {
      return this.schoolService.getStudentProfile(id, req.user);
    } catch (e: any) {
      if (e.status === 404) {
        throw new NotFoundException(e.message);
      }
      throw e;
    }
  }
}
