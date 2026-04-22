import { Module } from '@nestjs/common';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { SchoolModule } from '../school/school.module';

@Module({
  imports: [SchoolModule],
  controllers: [TeacherController],
  providers: [TeacherService],
})
export class TeacherModule {}
