import { Controller, Get, Param, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';
import { StudentsService } from './students.service';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  @Get('profile/:studentId')
  @Roles('HEADMASTER', 'TEACHER', 'PARENT')
  async getProfile(@Param('studentId') studentId: string, @Req() req: any) {
    return this.studentsService.findStudentFullProfileByStudentId(studentId, req.user);
  }

  @Get()
  @Roles('HEADMASTER', 'TEACHER', 'PARENT')
  async getAll(@Req() req: any) {
    return this.studentsService.findAllForRole(req.user);
  }

  @Get(':id/full-profile')
  @Roles('HEADMASTER', 'TEACHER', 'PARENT')
  async getFullProfile(@Param('id') id: string, @Req() req: any) {
    return this.studentsService.findStudentFullProfile(id, req.user);
  }
}
