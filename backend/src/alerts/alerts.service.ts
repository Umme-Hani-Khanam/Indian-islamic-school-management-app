import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { MockSchoolRepository } from '../school/repositories/mock-school.repository';
import { Alert, UserRole } from '../school/interfaces/school.interface';

@Injectable()
export class AlertsService {
  constructor(private readonly repository: MockSchoolRepository) {}

  async findAll(userId: string, role: string) {
    if (role === 'HEADMASTER') return this.repository.getAllAlerts();

    if (role === 'TEACHER') {
      const teacher = this.repository.getTeacherByUserId(userId);
      if (!teacher) return [];
      const classes = this.repository.getClassesByTeacher(userId);
      const alerts = [];
      for (const cls of classes) {
        alerts.push(...this.repository.getAlertsByClass(cls.id));
      }
      return [...new Set(alerts)]; // Deduplicate
    }

    if (role === 'PARENT') {
      const children = this.repository.getStudentsByParent(userId);
      const alerts = [];
      for (const child of children) {
        alerts.push(...this.repository.getAlertsByStudent(child.id));
      }
      return alerts;
    }

    throw new ForbiddenException('Unauthorized role');
  }

  async findOne(id: string, userId: string, role: string) {
    const alert = this.repository.getAlertById(id);
    if (!alert) throw new NotFoundException('Alert not found');

    // Access check
    if (role === 'HEADMASTER') return alert;
    
    if (role === 'PARENT') {
      const children = this.repository.getStudentsByParent(userId);
      if (!children.find(c => c.id === alert.studentId)) {
        throw new ForbiddenException('Not your child');
      }
      return alert;
    }

    if (role === 'TEACHER') {
      const student = this.repository.getStudentById(alert.studentId);
      if (!student) throw new NotFoundException('Student not found');
      const teacherClasses = this.repository.getClassesByTeacher(userId);
      if (!teacherClasses.find(c => c.id === student.classId)) {
        throw new ForbiddenException('Student not in your classes');
      }
      return alert;
    }
  }

  async create(dto: any, userId: string, role: string) {
    // Restriction: Parents can only raise specific categories (mapped here to titles for simplicity or priority)
    if (role === 'PARENT') {
      const allowedCategories = ['Medical Support', 'Academic Concern', 'Counseling Request'];
      if (!allowedCategories.some(c => dto.title.includes(c))) {
        throw new ForbiddenException('Parents can only raise specific support alerts');
      }
      
      const children = this.repository.getStudentsByParent(userId);
      if (!children.find(c => c.id === dto.studentId)) {
        throw new ForbiddenException('Unauthorized student ID');
      }
    }

    return this.repository.addAlert({
      ...dto,
      raisedByRole: role as any,
      createdByUserId: userId,
      status: 'OPEN'
    });
  }

  async update(id: string, update: any, userId: string, role: string) {
    const alert = await this.findOne(id, userId, role);
    
    // Only staff can update status to IN_PROGRESS or RESOLVED
    if (role === 'PARENT' && update.status && update.status !== 'OPEN') {
      throw new ForbiddenException('Parents cannot resolve alerts');
    }

    return this.repository.updateAlert(id, update, userId);
  }
}
