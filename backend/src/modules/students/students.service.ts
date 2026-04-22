import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { TeacherAssignment } from '../assignments/entities/teacher-assignment.entity';
import { Mark } from '../marks/entities/mark.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { Remark } from '../remarks/entities/remark.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    @InjectRepository(TeacherAssignment)
    private assignmentRepository: Repository<TeacherAssignment>,
    @InjectRepository(Mark)
    private markRepository: Repository<Mark>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(Remark)
    private remarkRepository: Repository<Remark>,
  ) {}

  async findByStudentId(studentId: string): Promise<Student> {
    const student = await this.studentsRepository.findOne({
      where: { studentId },
      relations: ['class', 'parent'],
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return student;
  }

  async findStudentFullProfileByStudentId(studentId: string, user: any) {
    const student = await this.findByStudentId(studentId);
    return this.findStudentFullProfile(student.id, user);
  }

  async findStudentFullProfile(studentId: string, user: any) {
    const student = await this.studentsRepository.findOne({
      where: { id: studentId },
      relations: ['class', 'parent'],
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (user.role === 'TEACHER') {
      const permitted = await this.assignmentRepository.findOne({ where: { teacherId: user.teacherId, classId: student.classId } });
      if (!permitted) {
        throw new UnauthorizedException('Teacher cannot view this student');
      }
    }

    if (user.role === 'PARENT' && user.studentId !== student.studentId) {
      throw new UnauthorizedException('Parent can only view their own child');
    }

    const marks = await this.markRepository.find({
      where: { studentId: student.id },
      relations: ['subject'],
      order: { date: 'DESC' },
      take: 10,
    });

    const attendanceRecords = await this.attendanceRepository.find({
      where: { studentId: student.id },
      order: { date: 'DESC' },
      take: 30,
    });

    const remarks = await this.remarkRepository.find({
      where: { studentId: student.id },
      relations: ['teacher'],
      order: { date: 'DESC' },
      take: 10,
    });

    const attendanceSummary = {
      present: attendanceRecords.filter((item) => item.status === 'Present').length,
      absent: attendanceRecords.filter((item) => item.status === 'Absent').length,
      total: attendanceRecords.length,
    };

    const subjects = marks.map((mark) => ({ id: mark.subject.id, name: mark.subject.name }));

    return {
      student,
      class: student.class,
      parent: student.parent ? { id: student.parent.id, name: student.parent.name } : null,
      marks,
      attendanceSummary,
      remarks,
      subjects,
    };
  }

  async findStudentsByClassId(classId: string, user: any) {
    if (user.role === 'TEACHER') {
      const assignment = await this.assignmentRepository.findOne({ where: { teacherId: user.teacherId, classId } });
      if (!assignment) {
        throw new UnauthorizedException('Teacher cannot access students in this class');
      }
    }

    return this.studentsRepository.find({
      where: { classId },
      relations: ['class'],
      order: { name: 'ASC' },
    });
  }

  async findAllForRole(user: any) {
    if (user.role === 'HEADMASTER') {
      return this.studentsRepository.find({ relations: ['class', 'parent'], order: { name: 'ASC' } });
    }

    if (user.role === 'TEACHER') {
      const assignments = await this.assignmentRepository.find({ where: { teacherId: user.teacherId } });
      const classIds = assignments.map((assignment) => assignment.classId);
      if (!classIds.length) {
        return [];
      }
      return this.studentsRepository.find({
        where: { classId: In(classIds) },
        relations: ['class', 'parent'],
        order: { name: 'ASC' },
      });
    }

    if (user.role === 'PARENT') {
      const student = await this.studentsRepository.findOne({
        where: { studentId: user.studentId },
        relations: ['class', 'parent'],
      });
      return student ? [student] : [];
    }

    return [];
  }
}
