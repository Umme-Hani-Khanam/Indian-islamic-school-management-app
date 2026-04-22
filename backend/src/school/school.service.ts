import { Injectable, ForbiddenException } from '@nestjs/common';
import { MockSchoolRepository } from './repositories/mock-school.repository';
import { Class, Student, StudentProfileResponse, SchoolOverview } from './interfaces/school.interface';

@Injectable()
export class SchoolService {
  constructor(private readonly repository: MockSchoolRepository) {}

  getClasses(user: any): Class[] {
    const userId = user.userId || user.sub;
    const { role } = user;
    if (role === 'HEADMASTER') {
      return this.repository.getAllClasses();
    }
    if (role === 'TEACHER') {
      return this.repository.getClassesByTeacher(userId);
    }
    // Parent doesn't usually browse classes, return empty but safe
    return [];
  }

  getStudents(classId: string, user: any): Student[] {
    const userId = user.userId || user.sub;
    const { role } = user;
    if (role === 'HEADMASTER') {
      return this.repository.getStudentsByClass(classId);
    }
    if (role === 'TEACHER') {
      const students = this.repository.getStudentsByTeacher(userId, classId);
      if (!students.length) {
        throw new ForbiddenException('You are not authorized to view students for this class');
      }
      return students;
    }
    if (role === 'PARENT') {
      const students = this.repository.getStudentsByParent(userId);
      return students.filter(s => s.classId === classId);
    }
    return [];
  }

  getStudentProfile(studentId: string, user: any): StudentProfileResponse {
    const userId = user.userId || user.sub;
    const { role } = user;
    
    // Check authorization boundary
    if (role === 'TEACHER') {
      // Is this teacher assigned to this student's class?
      const student = this.repository.getStudentById(studentId);
      if (!student) throw new ForbiddenException('Student not found'); // Mapped via exception handling at controller
      const servesStudent = this.repository.getStudentsByTeacher(userId, student.classId).length > 0;
      if (!servesStudent) throw new ForbiddenException('You are not authorized to view this student profile');
    }
    
    if (role === 'PARENT') {
      const student = this.repository.getStudentById(studentId);
      if (student?.parentId !== userId) {
        throw new ForbiddenException('You are not authorized to view this student profile');
      }
    }

    return this.repository.getStudentProfile(studentId);
  }

  getOverview(user: any): SchoolOverview {
    const { role } = user;
    if (role !== 'HEADMASTER') {
      throw new ForbiddenException('Only institutional heads can access this overview.');
    }

    return {
      enrollmentCount: this.repository.getStudentCount(),
      classCount: this.repository.getClassCount(),
      teacherCount: this.repository.getTeacherCount(),
      criticalAlerts: this.repository.getCriticalAlertsCount(),
      staffAttendance: '98.5%', // Mocking global staff attendance
      weakPerformanceClasses: ['Grade 8-B', 'Grade 10-A'], // Mocking watchlist
    };
  }
}
