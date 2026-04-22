import { Injectable, ForbiddenException } from '@nestjs/common';
import { MockSchoolRepository } from '../school/repositories/mock-school.repository';
import { CreateMarkDto, CreateRemarkDto } from './dto/teacher.dto';

@Injectable()
export class TeacherService {
  constructor(private readonly repository: MockSchoolRepository) {}

  private getTeacherOrThrow(userId: string) {
    const teacher = this.repository.getTeacherByUserId(userId);
    if (!teacher) throw new ForbiddenException('Teacher profile not found');
    return teacher;
  }

  private ensureStudentAssigned(teacherUserId: string, studentId: string) {
    const teacher = this.getTeacherOrThrow(teacherUserId);
    const student = this.repository.getStudentById(studentId);
    if (!student) throw new ForbiddenException('Student not found');
    
    const assignedStudents = this.repository.getStudentsByTeacher(teacherUserId, student.classId);
    if (!assignedStudents.find(s => s.id === studentId)) {
      throw new ForbiddenException('You are not authorized to access this student');
    }
    return { teacher, student };
  }

  getDashboard(user: any) {
    const userId = user.userId || user.sub;
    const teacher = this.getTeacherOrThrow(userId);
    const classes = this.repository.getClassesByTeacher(userId);
    let totalStudents = 0;
    classes.forEach(c => {
      totalStudents += this.repository.getStudentsByTeacher(userId, c.id).length;
    });

    return {
      teacher,
      classes,
      summary: {
        totalClasses: classes.length,
        totalStudents,
        averageGrowth: '+5.2%',
        teacherScore: 92,
        teacherRanking: 'Top 10%',
        feedbackScore: '4.8/5'
      },
      pendingItems: [
        'Enter mid-term marks for LKG A',
        'Review 3 negative remarks',
      ]
    };
  }

  getStudents(user: any) {
    const userId = user.userId || user.sub;
    const classes = this.repository.getClassesByTeacher(userId);
    const assignedStudents: any[] = [];
    for (const c of classes) {
      const studentsInClass = this.repository.getStudentsByTeacher(userId, c.id);
      assignedStudents.push(...studentsInClass);
    }
    return assignedStudents;
  }

  getStudentDetails(user: any, studentId: string) {
    const userId = user.userId || user.sub;
    this.ensureStudentAssigned(userId, studentId);
    return this.repository.getStudentProfile(studentId);
  }

  addMark(user: any, dto: CreateMarkDto) {
    const userId = user.userId || user.sub;
    const { teacher } = this.ensureStudentAssigned(userId, dto.studentId);
    return this.repository.addMark(dto.studentId, dto.subjectId, teacher.id, dto.marks);
  }

  addRemark(user: any, dto: CreateRemarkDto) {
    const userId = user.userId || user.sub;
    const { teacher } = this.ensureStudentAssigned(userId, dto.studentId);
    return this.repository.addRemark(dto.studentId, teacher.id, dto.comment, dto.type);
  }
}
