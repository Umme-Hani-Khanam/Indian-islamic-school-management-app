import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mark } from './entities/mark.entity';
import { CreateMarkDto } from './dto/create-mark.dto';
import { FilterMarksDto } from './dto/filter-marks.dto';
import { Student } from '../students/entities/student.entity';
import { Subject } from '../subjects/subject.entity';
import { TeacherAssignment } from '../assignments/entities/teacher-assignment.entity';

@Injectable()
export class MarksService {
  constructor(
    @InjectRepository(Mark)
    private marksRepository: Repository<Mark>,
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    @InjectRepository(Subject)
    private subjectsRepository: Repository<Subject>,
    @InjectRepository(TeacherAssignment)
    private assignmentRepository: Repository<TeacherAssignment>,
  ) {}

  async create(createMarkDto: CreateMarkDto, user: any) {
    const student = await this.studentsRepository.findOne({ where: { id: createMarkDto.studentId } });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (user.role === 'TEACHER') {
      const permitted = await this.assignmentRepository.findOne({ where: { teacherId: user.teacherId, classId: student.classId } });
      if (!permitted) {
        throw new UnauthorizedException('Teacher cannot add marks for this student');
      }
    }

    if (user.role === 'PARENT') {
      throw new UnauthorizedException('Parents cannot add marks');
    }

    const subject = await this.subjectsRepository.findOne({ where: { id: createMarkDto.subjectId } });
    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    const mark = this.marksRepository.create({
      student,
      subject,
      marks: createMarkDto.marks,
      date: createMarkDto.date,
    });
    return this.marksRepository.save(mark);
  }

  async getStudentMarks(studentId: string, filter: FilterMarksDto, user: any) {
    const student = await this.studentsRepository.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    await this.ensureAccessToStudent(student, user);

    const query = this.marksRepository.createQueryBuilder('mark')
      .where('mark.studentId = :studentId', { studentId })
      .leftJoinAndSelect('mark.subject', 'subject')
      .orderBy('mark.date', 'DESC');

    this.addDateFilters(query, filter);

    const [items, total] = await query
      .skip((filter.page - 1) * filter.limit)
      .take(filter.limit)
      .getManyAndCount();

    return { items, total, page: filter.page, limit: filter.limit };
  }

  async getClassMarks(classId: string, filter: FilterMarksDto, user: any) {
    if (user.role === 'TEACHER') {
      const permitted = await this.assignmentRepository.findOne({ where: { teacherId: user.teacherId, classId } });
      if (!permitted) {
        throw new UnauthorizedException('Access denied to class marks');
      }
    }

    const query = this.marksRepository.createQueryBuilder('mark')
      .leftJoinAndSelect('mark.subject', 'subject')
      .leftJoinAndSelect('mark.student', 'student')
      .where('student.classId = :classId', { classId })
      .orderBy('mark.date', 'DESC');

    this.addDateFilters(query, filter);

    const [items, total] = await query
      .skip((filter.page - 1) * filter.limit)
      .take(filter.limit)
      .getManyAndCount();

    return { items, total, page: filter.page, limit: filter.limit };
  }

  private addDateFilters(query: any, filter: FilterMarksDto) {
    if (filter.dateFrom) {
      query.andWhere('mark.date >= :dateFrom', { dateFrom: filter.dateFrom });
    }
    if (filter.dateTo) {
      query.andWhere('mark.date <= :dateTo', { dateTo: filter.dateTo });
    }
  }

  private async ensureAccessToStudent(student: Student, user: any) {
    if (user.role === 'TEACHER') {
      const permitted = await this.assignmentRepository.findOne({ where: { teacherId: user.teacherId, classId: student.classId } });
      if (!permitted) {
        throw new UnauthorizedException('Access denied to student');
      }
    }
    if (user.role === 'PARENT' && user.studentId !== student.studentId) {
      throw new UnauthorizedException('Parents can only view their own child');
    }
  }
}
