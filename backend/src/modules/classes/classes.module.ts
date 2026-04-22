import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import { ClassEntity } from './class.entity';
import { Student } from '../students/entities/student.entity';
import { TeacherAssignment } from '../assignments/entities/teacher-assignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClassEntity, Student, TeacherAssignment])],
  controllers: [ClassesController],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassesModule {}
