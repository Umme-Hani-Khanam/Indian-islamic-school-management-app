import { Injectable, ForbiddenException } from '@nestjs/common';
import { MockSchoolRepository } from '../school/repositories/mock-school.repository';

// Mock homework completion data per student
const homeworkData: Record<string, { total: number; completed: number }> = {
  '1': { total: 20, completed: 17 },
};

// Mock teacher performance scores
const teacherScores: Record<string, number> = {
  '1': 92,
  '2': 88,
};

@Injectable()
export class ParentService {
  constructor(private readonly repository: MockSchoolRepository) {}

  private getChildOrThrow(userId: string) {
    const children = this.repository.getStudentsByParent(userId);
    if (!children.length) throw new ForbiddenException('No child linked to this parent account');
    return children[0]; // single child per parent for now
  }

  private ensureChildAccess(userId: string, studentId: string) {
    const children = this.repository.getStudentsByParent(userId);
    if (!children.find(c => c.id === studentId)) {
      throw new ForbiddenException('You are not authorized to view this student');
    }
  }

  getDashboard(user: any) {
    const userId = user.userId || user.sub;
    const child = this.getChildOrThrow(userId);
    const classDetails = this.repository.getClassById(child.classId);
    const profile = this.repository.getStudentProfile(child.id);

    const totalDays = profile.attendance.length;
    const presentDays = profile.attendance.filter(a => a.status === 'PRESENT').length;
    const attendancePct = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

    const latestMarks = profile.subjects
      .filter(s => s.marks.length > 0)
      .map(s => ({
        subject: s.subject.name,
        score: s.marks[s.marks.length - 1].score,
        total: s.marks[s.marks.length - 1].total,
      }));

    const alertsCount = profile.alerts.filter(a => a.status !== 'RESOLVED').length;
    const gpa = latestMarks.length > 0 
      ? latestMarks.reduce((acc, m) => acc + (m.score / m.total), 0) / latestMarks.length * 10 
      : 0;

    return {
      child: { id: child.id, name: child.name, rollNumber: child.rollNumber },
      classDetails,
      attendancePct,
      latestMarks,
      gpa: parseFloat(gpa.toFixed(1)),
      ratingScore: profile.ratingScore,
      alertsCount,
      alerts: profile.alerts,
      monthlyProgress: profile.monthlyProgress,
    };
  }

  getChild(user: any) {
    const userId = user.userId || user.sub;
    const child = this.getChildOrThrow(userId);
    return this.repository.getStudentProfile(child.id);
  }

  getChildPerformance(user: any) {
    const userId = user.userId || user.sub;
    const child = this.getChildOrThrow(userId);
    const profile = this.repository.getStudentProfile(child.id);
    
    // Group homework by subject
    const subjectNames: Record<string, string> = {};
    profile.subjects.forEach(s => subjectNames[s.subject.id] = s.subject.name);

    const homeworkBySubject = profile.subjects.map(s => {
      const tasks = profile.homeworkTasks.filter(ht => ht.subjectId === s.subject.id);
      const completed = tasks.filter(t => t.isCompleted).length;
      return {
        subject: s.subject.name,
        total: tasks.length,
        completed,
        completionPct: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0,
        tasks: tasks.map(t => ({ title: t.title, isCompleted: t.isCompleted }))
      };
    });

    const assignedTeachers = profile.assignedTeachers.map(at => ({
      employeeId: at.teacher.employeeId,
      department: at.teacher.department,
      subject: at.subject.name,
      performanceScore: at.teacher.monthlyScore ?? 85,
      ranking: at.teacher.performanceRanking ?? 'N/A',
      guidanceEffectiveness: at.teacher.guidanceEfficiency ?? 80,
    }));

    return {
      student: profile.student,
      subjects: profile.subjects,
      dailyPerformance: profile.dailyPerformance,
      monthlyProgress: profile.monthlyProgress,
      positiveRemarks: profile.positiveRemarks,
      negativeRemarks: profile.negativeRemarks,
      homework: homeworkBySubject || [],
      assignedTeachers,
    };
  }

  getAlerts(user: any) {
    const userId = user.userId || user.sub;
    const child = this.getChildOrThrow(userId);
    const profile = this.repository.getStudentProfile(child.id);
    return profile.alerts;
  }
}
