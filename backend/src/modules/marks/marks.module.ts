import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarksController } from './marks.controller';
import { MarksService } from './marks.service';
import { Mark } from './entities/mark.entity';
import { Student } from '../students/entities/student.entity';
import { Subject } from '../subjects/subject.entity';
import { TeacherAssignment } from '../assignments/entities/teacher-assignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mark, Student, Subject, TeacherAssignment])],
  controllers: [MarksController],
  providers: [MarksService],
  exports: [MarksService],
})
export class MarksModule {}
