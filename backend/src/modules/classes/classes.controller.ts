import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';
import { ClassesService } from './classes.service';

@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClassesController {
  constructor(private classesService: ClassesService) {}

  @Get()
  @Roles('HEADMASTER', 'TEACHER')
  async getAll() {
    return this.classesService.findAll();
  }

  @Get(':id/students')
  @Roles('HEADMASTER', 'TEACHER')
  async getStudents(@Param('id') id: string, @Req() req: any) {
    return this.classesService.findStudentsByClass(id, req.user);
  }
}
