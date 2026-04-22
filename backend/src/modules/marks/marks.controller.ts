import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';
import { CreateMarkDto } from './dto/create-mark.dto';
import { FilterMarksDto } from './dto/filter-marks.dto';
import { MarksService } from './marks.service';

@Controller('marks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MarksController {
  constructor(private marksService: MarksService) {}

  @Post()
  @Roles('HEADMASTER', 'TEACHER')
  async create(@Body() body: CreateMarkDto, @Req() req: any) {
    return this.marksService.create(body, req.user);
  }

  @Get('student/:id')
  @Roles('HEADMASTER', 'TEACHER', 'PARENT')
  async getStudentMarks(@Param('id') id: string, @Query() query: FilterMarksDto, @Req() req: any) {
    return this.marksService.getStudentMarks(id, query, req.user);
  }

  @Get('class/:classId')
  @Roles('HEADMASTER', 'TEACHER')
  async getClassMarks(@Param('classId') classId: string, @Query() query: FilterMarksDto, @Req() req: any) {
    return this.marksService.getClassMarks(classId, query, req.user);
  }
}
