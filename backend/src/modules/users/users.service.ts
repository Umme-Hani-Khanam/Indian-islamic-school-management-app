import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { Student } from '../students/entities/student.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {}

  async findByLogin(identifier: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: [{ email: identifier }, { username: identifier }, { studentId: identifier }],
      relations: ['student'],
    });
    return user || null;
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id }, relations: ['student'] });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async seedUsers() {
    const existing = await this.usersRepository.count();
    if (existing > 0) return;

    const passwordHash = await bcrypt.hash('Password123', 10);
    const headmaster = this.usersRepository.create({
      name: 'Headmaster',
      username: 'headmaster',
      email: 'headmaster@school.local',
      password: passwordHash,
      role: UserRole.HEADMASTER,
    });

    const teacher = this.usersRepository.create({
      name: 'Teacher A',
      username: 'teacher1',
      email: 'teacher1@school.local',
      password: passwordHash,
      role: UserRole.TEACHER,
    });

    await this.usersRepository.save(teacher);

    const student = this.studentsRepository.create({
      studentId: 'STU1001',
      name: 'Ali Khan',
      grade: '5',
      section: 'A',
      parentName: 'Mrs. Khan',
      assignedTeacherId: teacher.id,
      attendance: 95,
      marks: { math: 78, english: 82, islamiyat: 91 },
      remarks: 'Consistent progress.',
    });
    await this.studentsRepository.save(student);

    const parent = this.usersRepository.create({
      name: 'Mrs. Khan',
      username: 'parent1',
      email: 'parent1@school.local',
      password: passwordHash,
      role: UserRole.PARENT,
      student: student,
      studentId: student.studentId,
    });

    await this.usersRepository.save([headmaster, parent]);
  }
}
