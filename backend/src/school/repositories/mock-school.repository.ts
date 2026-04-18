import { Injectable, NotFoundException } from '@nestjs/common';
import { 
  Class, Student, Teacher, Subject, TeacherAssignment, 
  Attendance, Marks, Remarks, StudentProfileResponse 
} from '../interfaces/school.interface';

@Injectable()
export class MockSchoolRepository {
  private classes: Class[] = [
    { id: '1', name: 'Grade 10', section: 'A' },
    { id: '2', name: 'Grade 10', section: 'B' },
  ];

  private students: Student[] = [
    { id: '1', name: 'Zayed Omar', rollNumber: '101', classId: '1', parentId: '3' }, // parentId '3' matches parent user
    { id: '2', name: 'Aisha Malik', rollNumber: '102', classId: '1', parentId: '99' },
    { id: '3', name: 'Yusuf Ahmed', rollNumber: '201', classId: '2', parentId: '99' },
  ];

  private teachers: Teacher[] = [
    { id: '1', userId: '2', employeeId: 'T100', department: 'Science' } // userId '2' matches teacher user
  ];

  private subjects: Subject[] = [
    { id: '1', name: 'Mathematics', code: 'MATH10' },
    { id: '2', name: 'Islamic Studies', code: 'ISL10' },
  ];

  private assignments: TeacherAssignment[] = [
    { id: '1', teacherId: '1', classId: '1', subjectId: '1' }, // Teacher 1 teaches Class 1
  ];

  private attendance: Attendance[] = [
    { id: '1', studentId: '1', date: '2023-10-01', status: 'PRESENT' },
    { id: '2', studentId: '1', date: '2023-10-02', status: 'LATE' },
    { id: '3', studentId: '2', date: '2023-10-01', status: 'ABSENT' },
  ];

  private marks: Marks[] = [
    { id: '1', studentId: '1', subjectId: '1', date: '2023-09-15', score: 85, total: 100, examType: 'Midterm' },
    { id: '2', studentId: '1', subjectId: '2', date: '2023-09-16', score: 92, total: 100, examType: 'Midterm' },
  ];

  private remarks: Remarks[] = [
    { id: '1', studentId: '1', teacherId: '1', date: '2023-09-20', comment: 'Excellent participation in class.' },
  ];

  // --- Filtering Methods strictly in Repository ---

  // Classes
  getAllClasses(): Class[] {
    return this.classes;
  }

  getClassesByTeacher(userId: string): Class[] {
    const teacher = this.teachers.find(t => t.userId === userId);
    if (!teacher) return [];
    const assignedClassIds = this.assignments.filter(a => a.teacherId === teacher.id).map(a => a.classId);
    return this.classes.filter(c => assignedClassIds.includes(c.id));
  }

  getClassById(classId: string): Class | undefined {
    return this.classes.find(c => c.id === classId);
  }

  // Students
  getStudentsByClass(classId: string): Student[] {
    return this.students.filter(s => s.classId === classId);
  }

  getStudentsByTeacher(userId: string, classId: string): Student[] {
    const teacher = this.teachers.find(t => t.userId === userId);
    if (!teacher) return [];
    
    const servesClass = this.assignments.some(a => a.teacherId === teacher.id && a.classId === classId);
    if (!servesClass) return [];
    
    return this.getStudentsByClass(classId);
  }

  getStudentsByParent(parentId: string): Student[] {
    return this.students.filter(s => s.parentId === parentId);
  }

  getStudentById(studentId: string): Student | undefined {
    return this.students.find(s => s.id === studentId);
  }

  // Profile Aggregation
  getStudentProfile(studentId: string): StudentProfileResponse {
    const student = this.getStudentById(studentId);
    if (!student) throw new NotFoundException(`Student ID ${studentId} not found`);

    const classDetails = this.getClassById(student.classId);
    
    const studentMarks = this.marks.filter(m => m.studentId === studentId);
    
    // Group marks by subject
    const subjectsAggregated = this.subjects.map(subject => ({
      subject,
      marks: studentMarks.filter(m => m.subjectId === subject.id),
    })).filter(agg => agg.marks.length > 0 || classDetails); // simplified: realistically linked to assignments
    
    const studentAttendance = this.attendance.filter(a => a.studentId === studentId);
    const studentRemarks = this.remarks.filter(r => r.studentId === studentId);

    return {
      student,
      classDetails,
      subjects: subjectsAggregated,
      attendance: studentAttendance,
      remarks: studentRemarks,
    };
  }
}
