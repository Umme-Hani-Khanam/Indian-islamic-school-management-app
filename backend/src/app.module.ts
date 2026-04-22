<<<<<<< HEAD
import { ParentModule } from './parent/parent.module';
import { AlertsModule } from './alerts/alerts.module';

@Module({
  imports: [AuthModule, UsersModule, SchoolModule, TeacherModule, ParentModule, AlertsModule],
  controllers: [AppController],
  providers: [AppService],
=======
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { StudentsModule } from './modules/students/students.module';
import { ClassesModule } from './modules/classes/classes.module';
import { MarksModule } from './modules/marks/marks.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { User } from './modules/users/entities/user.entity';
import { Student } from './modules/students/entities/student.entity';
import { ClassEntity } from './modules/classes/class.entity';
import { Teacher } from './modules/teachers/teacher.entity';
import { Subject } from './modules/subjects/subject.entity';
import { TeacherAssignment } from './modules/assignments/entities/teacher-assignment.entity';
import { Mark } from './modules/marks/entities/mark.entity';
import { Attendance } from './modules/attendance/entities/attendance.entity';
import { Remark } from './modules/remarks/entities/remark.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'school_app',
      entities: [User, Student, ClassEntity, Teacher, Subject, TeacherAssignment, Mark, Attendance, Remark],
      synchronize: true,
      logging: false,
    }),
    AuthModule,
    UsersModule,
    StudentsModule,
    ClassesModule,
    MarksModule,
    AttendanceModule,
  ],
>>>>>>> e60a51e (Fixed web errors)
})
export class AppModule {}
