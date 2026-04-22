import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { Student } from './entities/student.entity';
import { ClassEntity } from '../classes/class.entity';
import { TeacherAssignment } from '../assignments/entities/teacher-assignment.entity';
import { Mark } from '../marks/entities/mark.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { Remark } from '../remarks/entities/remark.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, ClassEntity, TeacherAssignment, Mark, Attendance, Remark])],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
