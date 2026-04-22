import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { Attendance } from './entities/attendance.entity';
import { Student } from '../students/entities/student.entity';
import { TeacherAssignment } from '../assignments/entities/teacher-assignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, Student, TeacherAssignment])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
