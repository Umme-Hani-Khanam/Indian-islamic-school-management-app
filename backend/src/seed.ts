import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './modules/users/entities/user.entity';
import { ClassEntity } from './modules/classes/class.entity';
import { Teacher } from './modules/teachers/teacher.entity';
import { Subject } from './modules/subjects/subject.entity';
import { TeacherAssignment } from './modules/assignments/entities/teacher-assignment.entity';
import { Student } from './modules/students/entities/student.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const userRepo = dataSource.getRepository(User);
  const classRepo = dataSource.getRepository(ClassEntity);
  const teacherRepo = dataSource.getRepository(Teacher);
  const subjectRepo = dataSource.getRepository(Subject);
  const assignmentRepo = dataSource.getRepository(TeacherAssignment);
  const studentRepo = dataSource.getRepository(Student);

  const existingUsers = await userRepo.count();
  if (existingUsers > 0) {
    console.log('Seed data already exists. Skipping.');
    await app.close();
    return;
  }

  const passwordHash = await bcrypt.hash('Password123', 10);

  const headmaster = userRepo.create({
    name: 'Headmaster',
    username: 'headmaster',
    email: 'headmaster@school.local',
    password: passwordHash,
    role: UserRole.HEADMASTER,
  });
  await userRepo.save(headmaster);

  const teacherProfile = teacherRepo.create({ name: 'Teacher A' });
  await teacherRepo.save(teacherProfile);

  const teacherUser = userRepo.create({
    name: 'Teacher A',
    username: 'teacher1',
    email: 'teacher1@school.local',
    password: passwordHash,
    role: UserRole.TEACHER,
    teacherId: teacherProfile.id,
  });
  await userRepo.save(teacherUser);

  const class5A = classRepo.create({ name: '5th', section: 'A' });
  const class6A = classRepo.create({ name: '6th', section: 'A' });
  await classRepo.save([class5A, class6A]);

  const subjects = subjectRepo.create([
    { name: 'Math' },
    { name: 'English' },
    { name: 'Islamiyat' },
  ]);
  await subjectRepo.save(subjects);

  const assignments = [];
  assignments.push(
    assignmentRepo.create({
      teacherId: teacherProfile.id,
      classId: class5A.id,
      subjectId: subjects[0].id,
    }),
    assignmentRepo.create({
      teacherId: teacherProfile.id,
      classId: class5A.id,
      subjectId: subjects[1].id,
    }),
  );
  await assignmentRepo.save(assignments);

  const parentUser = userRepo.create({
    name: 'Mrs. Khan',
    username: 'parent1',
    email: 'parent1@school.local',
    password: passwordHash,
    role: UserRole.PARENT,
  });
  await userRepo.save(parentUser);

  const student = studentRepo.create({
    studentId: 'STU1001',
    name: 'Ali Khan',
    classId: class5A.id,
    parentId: parentUser.id,
  });
  await studentRepo.save(student);

  parentUser.studentId = student.studentId;
  await userRepo.save(parentUser);

  console.log('Seed complete.');
  await app.close();
}

bootstrap().catch((error) => {
  console.error('Seed error', error);
  process.exit(1);
});
