import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { FilterAttendanceDto } from './dto/filter-attendance.dto';
import { Student } from '../students/entities/student.entity';
import { TeacherAssignment } from '../assignments/entities/teacher-assignment.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    @InjectRepository(TeacherAssignment)
    private assignmentRepository: Repository<TeacherAssignment>,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto, user: any) {
    const student = await this.studentsRepository.findOne({ where: { id: createAttendanceDto.studentId } });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (user.role === 'TEACHER') {
      const permitted = await this.assignmentRepository.findOne({ where: { teacherId: user.teacherId, classId: student.classId } });
      if (!permitted) {
        throw new UnauthorizedException('Teacher cannot mark attendance for this student');
      }
    }

    if (user.role === 'PARENT') {
      throw new UnauthorizedException('Parents cannot update attendance');
    }

    const record = this.attendanceRepository.create({
      student,
      date: createAttendanceDto.date,
      status: createAttendanceDto.status,
    });

    return this.attendanceRepository.save(record);
  }

  async getStudentAttendance(studentId: string, filter: FilterAttendanceDto, user: any) {
    const student = await this.studentsRepository.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    await this.ensureAccess(student, user);

    const query = this.attendanceRepository.createQueryBuilder('attendance')
      .where('attendance.studentId = :studentId', { studentId })
      .orderBy('attendance.date', 'DESC');

    this.addDateFilters(query, filter);

    const [items, total] = await query
      .skip((filter.page - 1) * filter.limit)
      .take(filter.limit)
      .getManyAndCount();

    return { items, total, page: filter.page, limit: filter.limit };
  }

  async getClassAttendance(classId: string, filter: FilterAttendanceDto, user: any) {
    if (user.role === 'TEACHER') {
      const permitted = await this.assignmentRepository.findOne({ where: { teacherId: user.teacherId, classId } });
      if (!permitted) {
        throw new UnauthorizedException('Access denied to class attendance');
      }
    }

    const query = this.attendanceRepository.createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.student', 'student')
      .where('student.classId = :classId', { classId })
      .orderBy('attendance.date', 'DESC');

    this.addDateFilters(query, filter);

    const [items, total] = await query
      .skip((filter.page - 1) * filter.limit)
      .take(filter.limit)
      .getManyAndCount();

    return { items, total, page: filter.page, limit: filter.limit };
  }

  private addDateFilters(query: any, filter: FilterAttendanceDto) {
    if (filter.dateFrom) {
      query.andWhere('attendance.date >= :dateFrom', { dateFrom: filter.dateFrom });
    }
    if (filter.dateTo) {
      query.andWhere('attendance.date <= :dateTo', { dateTo: filter.dateTo });
    }
  }

  private async ensureAccess(student: Student, user: any) {
    if (user.role === 'TEACHER') {
      const permitted = await this.assignmentRepository.findOne({ where: { teacherId: user.teacherId, classId: student.classId } });
      if (!permitted) {
        throw new UnauthorizedException('Access denied to student attendance');
      }
    }
    if (user.role === 'PARENT' && user.studentId !== student.studentId) {
      throw new UnauthorizedException('Parents can only view their own child');
    }
  }
}
