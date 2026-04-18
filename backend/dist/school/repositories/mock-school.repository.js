"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockSchoolRepository = void 0;
const common_1 = require("@nestjs/common");
let MockSchoolRepository = class MockSchoolRepository {
    classes = [
        { id: '1', name: 'Grade 10', section: 'A' },
        { id: '2', name: 'Grade 10', section: 'B' },
    ];
    students = [
        { id: '1', name: 'Zayed Omar', rollNumber: '101', classId: '1', parentId: '3' },
        { id: '2', name: 'Aisha Malik', rollNumber: '102', classId: '1', parentId: '99' },
        { id: '3', name: 'Yusuf Ahmed', rollNumber: '201', classId: '2', parentId: '99' },
    ];
    teachers = [
        { id: '1', userId: '2', employeeId: 'T100', department: 'Science' }
    ];
    subjects = [
        { id: '1', name: 'Mathematics', code: 'MATH10' },
        { id: '2', name: 'Islamic Studies', code: 'ISL10' },
    ];
    assignments = [
        { id: '1', teacherId: '1', classId: '1', subjectId: '1' },
    ];
    attendance = [
        { id: '1', studentId: '1', date: '2023-10-01', status: 'PRESENT' },
        { id: '2', studentId: '1', date: '2023-10-02', status: 'LATE' },
        { id: '3', studentId: '2', date: '2023-10-01', status: 'ABSENT' },
    ];
    marks = [
        { id: '1', studentId: '1', subjectId: '1', date: '2023-09-15', score: 85, total: 100, examType: 'Midterm' },
        { id: '2', studentId: '1', subjectId: '2', date: '2023-09-16', score: 92, total: 100, examType: 'Midterm' },
    ];
    remarks = [
        { id: '1', studentId: '1', teacherId: '1', date: '2023-09-20', comment: 'Excellent participation in class.' },
    ];
    getAllClasses() {
        return this.classes;
    }
    getClassesByTeacher(userId) {
        const teacher = this.teachers.find(t => t.userId === userId);
        if (!teacher)
            return [];
        const assignedClassIds = this.assignments.filter(a => a.teacherId === teacher.id).map(a => a.classId);
        return this.classes.filter(c => assignedClassIds.includes(c.id));
    }
    getClassById(classId) {
        return this.classes.find(c => c.id === classId);
    }
    getStudentsByClass(classId) {
        return this.students.filter(s => s.classId === classId);
    }
    getStudentsByTeacher(userId, classId) {
        const teacher = this.teachers.find(t => t.userId === userId);
        if (!teacher)
            return [];
        const servesClass = this.assignments.some(a => a.teacherId === teacher.id && a.classId === classId);
        if (!servesClass)
            return [];
        return this.getStudentsByClass(classId);
    }
    getStudentsByParent(parentId) {
        return this.students.filter(s => s.parentId === parentId);
    }
    getStudentById(studentId) {
        return this.students.find(s => s.id === studentId);
    }
    getStudentProfile(studentId) {
        const student = this.getStudentById(studentId);
        if (!student)
            throw new common_1.NotFoundException(`Student ID ${studentId} not found`);
        const classDetails = this.getClassById(student.classId);
        const studentMarks = this.marks.filter(m => m.studentId === studentId);
        const subjectsAggregated = this.subjects.map(subject => ({
            subject,
            marks: studentMarks.filter(m => m.subjectId === subject.id),
        })).filter(agg => agg.marks.length > 0 || classDetails);
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
};
exports.MockSchoolRepository = MockSchoolRepository;
exports.MockSchoolRepository = MockSchoolRepository = __decorate([
    (0, common_1.Injectable)()
], MockSchoolRepository);
//# sourceMappingURL=mock-school.repository.js.map