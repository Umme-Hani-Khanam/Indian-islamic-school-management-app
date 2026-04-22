import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassEntity } from './class.entity';
import { Student } from '../students/entities/student.entity';
import { TeacherAssignment } from '../assignments/entities/teacher-assignment.entity';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(ClassEntity)
    private classesRepository: Repository<ClassEntity>,
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    @InjectRepository(TeacherAssignment)
    private assignmentRepository: Repository<TeacherAssignment>,
  ) {}

  async findAll() {
    return this.classesRepository.find({ order: { name: 'ASC', section: 'ASC' } });
  }

  async findById(id: string) {
    const klass = await this.classesRepository.findOne({ where: { id } });
    if (!klass) {
      throw new NotFoundException('Class not found');
    }
    return klass;
  }

  async findStudentsByClass(classId: string, user: any) {
    await this.findById(classId);
    if (user.role === 'TEACHER') {
      const assignment = await this.assignmentRepository.findOne({ where: { teacherId: user.teacherId, classId } });
      if (!assignment) {
        throw new UnauthorizedException('Access denied to this class');
      }
    }

    return this.studentsRepository.find({ where: { classId }, order: { name: 'ASC' } });
  }
}
