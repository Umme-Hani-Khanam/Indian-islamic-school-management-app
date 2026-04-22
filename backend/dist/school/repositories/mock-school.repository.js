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
        { id: '1', name: 'LKG', section: 'A' },
        { id: '2', name: 'UKG', section: 'A' },
        { id: '3', name: 'Grade 1', section: 'A' },
        { id: '4', name: 'Grade 2', section: 'A' },
        { id: '5', name: 'Grade 3', section: 'A' },
        { id: '6', name: 'Grade 4', section: 'A' },
        { id: '7', name: 'Grade 5', section: 'A' },
        { id: '8', name: 'Grade 6', section: 'A' },
        { id: '9', name: 'Grade 7', section: 'A' },
        { id: '10', name: 'Grade 8', section: 'A' },
        { id: '11', name: 'Grade 9', section: 'A' },
        { id: '12', name: 'Grade 10', section: 'A' },
        { id: '13', name: 'Grade 10', section: 'B' },
    ];
    students = [
        { id: '1', name: 'Zayed Omar', rollNumber: '101', classId: '12', parentId: '3' },
        { id: '2', name: 'Aisha Malik', rollNumber: '102', classId: '12', parentId: '99' },
        { id: '3', name: 'Yusuf Ahmed', rollNumber: '201', classId: '13', parentId: '99' },
        { id: '4', name: 'Fatima Noor', rollNumber: '001', classId: '1', parentId: '99' },
    ];
    teachers = [
        { id: '1', userId: '2', employeeId: 'T100', department: 'Science', performanceRanking: 3, guidanceEfficiency: 94, monthlyScore: 92 },
        { id: '2', userId: '4', employeeId: 'T101', department: 'Mathematics', performanceRanking: 8, guidanceEfficiency: 88, monthlyScore: 85 },
    ];
    subjects = [
        { id: '1', name: 'Mathematics', code: 'MATH10' },
        { id: '2', name: 'Islamic Studies', code: 'ISL10' },
        { id: '3', name: 'Physics', code: 'PHY10' },
    ];
    assignments = [
        { id: '1', teacherId: '1', classId: '12', subjectId: '3' },
        { id: '2', teacherId: '2', classId: '12', subjectId: '1' },
    ];
    attendance = [
        { id: '1', studentId: '1', date: '2023-10-01', status: 'PRESENT' },
        { id: '2', studentId: '1', date: '2023-10-02', status: 'LATE' },
        { id: '3', studentId: '1', date: '2023-10-03', status: 'PRESENT' },
        { id: '4', studentId: '1', date: '2023-10-04', status: 'PRESENT' },
        { id: '5', studentId: '2', date: '2023-10-01', status: 'ABSENT' },
    ];
    marks = [
        { id: '1', studentId: '1', subjectId: '1', teacherId: '1', date: '2023-09-15', score: 85, total: 100, examType: 'Midterm' },
        { id: '2', studentId: '1', subjectId: '2', teacherId: '1', date: '2023-09-16', score: 92, total: 100, examType: 'Midterm' },
        { id: '3', studentId: '1', subjectId: '3', teacherId: '2', date: '2023-09-17', score: 78, total: 100, examType: 'Midterm' },
    ];
    remarks = [
        { id: '1', studentId: '1', teacherId: '1', date: '2023-09-20', comment: 'Excellent participation in Science class.', type: 'POSITIVE' },
        { id: '2', studentId: '1', teacherId: '2', date: '2023-09-25', comment: 'Needs to focus more during Math lectures.', type: 'NEGATIVE' },
        { id: '3', studentId: '1', teacherId: '1', date: '2023-10-05', comment: 'Great improvement in lab work.', type: 'POSITIVE' },
    ];
    alerts = [
        {
            id: '1', studentId: '1', title: 'Exam Violation', description: 'Talking during exam.',
            priority: 'MEDIUM', status: 'RESOLVED', raisedByRole: 'TEACHER', createdByUserId: '2',
            history: [{ date: '2023-09-10', status: 'RESOLVED', note: 'Issue addressed.', updatedBy: '2' }],
            createdAt: '2023-09-10', updatedAt: '2023-09-10'
        },
        {
            id: '2', studentId: '1', title: 'Prayer Assembly Absence', description: 'Skipped afternoon prayer assembly.',
            priority: 'HIGH', status: 'RESOLVED', raisedByRole: 'TEACHER', createdByUserId: '2',
            history: [{ date: '2023-10-12', status: 'RESOLVED', note: 'Warning issued.', updatedBy: '2' }],
            createdAt: '2023-10-12', updatedAt: '2023-10-12'
        },
        {
            id: '3', studentId: '2', title: 'Extended Unexcused Absence', description: 'Unexcused absence for 3 days.',
            priority: 'CRITICAL', status: 'OPEN', raisedByRole: 'TEACHER', createdByUserId: '2',
            history: [{ date: '2023-10-15', status: 'OPEN', note: 'Reported.', updatedBy: '2' }],
            createdAt: '2023-10-15', updatedAt: '2023-10-15'
        },
        {
            id: '4', studentId: '1', title: 'Academic Struggle', description: 'I am struggling with the new physics concepts.',
            priority: 'MEDIUM', status: 'IN_PROGRESS', raisedByRole: 'PARENT', createdByUserId: '3',
            history: [{ date: '2023-10-20', status: 'IN_PROGRESS', note: 'Counseling initiated.', updatedBy: '1' }],
            createdAt: '2023-10-20', updatedAt: '2023-10-21'
        },
        {
            id: '5', studentId: '1', title: 'Bullying Incident', description: 'Bullying reported in hallway.',
            priority: 'CRITICAL', status: 'OPEN', raisedByRole: 'TEACHER', createdByUserId: '2',
            proofImageUrl: 'https://placehold.co/400x300/e53935/white?text=Incident+Photo',
            history: [{ date: '2023-10-22', status: 'OPEN', note: 'Under investigation.', updatedBy: '2' }],
            createdAt: '2023-10-22', updatedAt: '2023-10-22'
        },
    ];
    homeworkTasks = [
        { id: '1', studentId: '1', subjectId: '1', title: 'Calculus Assignment 1', isCompleted: true },
        { id: '2', studentId: '1', subjectId: '1', title: 'Geometry Quiz Prep', isCompleted: false },
        { id: '3', studentId: '1', subjectId: '2', title: 'Chapter 4 Summary', isCompleted: true },
        { id: '4', studentId: '1', subjectId: '3', title: 'Physics Lab Report', isCompleted: true },
    ];
    dailyPerformances = {
        '1': [
            { date: '2023-10-01', score: 80 }, { date: '2023-10-02', score: 85 },
            { date: '2023-10-03', score: 75 }, { date: '2023-10-04', score: 90 },
            { date: '2023-10-05', score: 88 }
        ]
    };
    monthlyProgresses = {
        '1': [
            { month: 'Jun', score: 65 }, { month: 'Jul', score: 70 },
            { month: 'Aug', score: 75 }, { month: 'Sep', score: 82 },
            { month: 'Oct', score: 85 }
        ]
    };
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
        const positiveRemarks = studentRemarks.filter(r => r.type === 'POSITIVE');
        const negativeRemarks = studentRemarks.filter(r => r.type === 'NEGATIVE');
        const alerts = this.alerts.filter(a => a.studentId === studentId);
        const assignedTeachers = classDetails
            ? this.assignments
                .filter(a => a.classId === classDetails.id)
                .map(a => ({
                teacher: this.teachers.find(t => t.id === a.teacherId),
                subject: this.subjects.find(s => s.id === a.subjectId)
            }))
                .filter(a => a.teacher && a.subject)
            : [];
        const marksAvg = studentMarks.length > 0
            ? studentMarks.reduce((acc, m) => acc + ((m.score / m.total) * 100), 0) / studentMarks.length
            : 0;
        const marksScore = (marksAvg / 100) * 40;
        const attendPrct = studentAttendance.length > 0
            ? (studentAttendance.filter(a => a.status === 'PRESENT').length / studentAttendance.length) * 100
            : 0;
        const attendScore = (attendPrct / 100) * 30;
        const posScore = Math.min(20, positiveRemarks.length * 10);
        const discPenalty = Math.min(10, alerts.length * 5);
        const ratingScore = Math.max(0, Math.min(100, Math.round(marksScore + attendScore + posScore - discPenalty)));
        const dailyPerformance = this.dailyPerformances[studentId] || [];
        const monthlyProgress = this.monthlyProgresses[studentId] || [];
        const homeworkTasks = this.homeworkTasks.filter(ht => ht.studentId === studentId);
        return {
            student,
            classDetails,
            subjects: subjectsAggregated,
            attendance: studentAttendance,
            remarks: studentRemarks,
            positiveRemarks,
            negativeRemarks,
            alerts,
            dailyPerformance,
            monthlyProgress,
            assignedTeachers,
            homeworkTasks,
            ratingScore
        };
    }
    getTeacherByUserId(userId) {
        return this.teachers.find(t => t.userId === userId);
    }
    addMark(studentId, subjectId, teacherId, score) {
        const date = new Date().toISOString().split('T')[0];
        const existingIndex = this.marks.findIndex(m => m.studentId === studentId && m.subjectId === subjectId && m.date === date);
        if (existingIndex > -1) {
            this.marks[existingIndex].score = score;
            this.marks[existingIndex].teacherId = teacherId;
            return this.marks[existingIndex];
        }
        const newMark = {
            id: (this.marks.length + 1).toString(),
            studentId,
            subjectId,
            teacherId,
            date,
            score,
            total: 100,
            examType: 'Daily'
        };
        this.marks.push(newMark);
        return newMark;
    }
    addRemark(studentId, teacherId, comment, type) {
        const date = new Date().toISOString().split('T')[0];
        const newRemark = {
            id: (this.remarks.length + 1).toString(),
            studentId,
            teacherId,
            date,
            comment,
            type
        };
        this.remarks.push(newRemark);
        return newRemark;
    }
    getAllAlerts() {
        return this.alerts;
    }
    getAlertById(id) {
        return this.alerts.find(a => a.id === id);
    }
    getAlertsByStudent(studentId) {
        return this.alerts.filter(a => a.studentId === studentId);
    }
    getAlertsByClass(classId) {
        const studentIds = this.students.filter(s => s.classId === classId).map(s => s.id);
        return this.alerts.filter(a => studentIds.includes(a.studentId));
    }
    addAlert(dto) {
        const now = new Date().toISOString();
        const newAlert = {
            ...dto,
            id: (this.alerts.length + 1).toString(),
            createdAt: now,
            updatedAt: now,
            history: [{
                    date: now.split('T')[0],
                    status: dto.status,
                    note: `Alert created by ${dto.raisedByRole}`,
                    updatedBy: dto.createdByUserId
                }]
        };
        this.alerts.push(newAlert);
        return newAlert;
    }
    updateAlert(id, update, updatedBy) {
        const index = this.alerts.findIndex(a => a.id === id);
        if (index === -1)
            throw new common_1.NotFoundException('Alert not found');
        const now = new Date().toISOString();
        const alert = this.alerts[index];
        if (update.status && update.status !== alert.status) {
            alert.history.push({
                date: now.split('T')[0],
                status: update.status,
                note: update.description || 'Status changed',
                updatedBy
            });
        }
        this.alerts[index] = {
            ...alert,
            ...update,
            updatedAt: now
        };
        return this.alerts[index];
    }
};
exports.MockSchoolRepository = MockSchoolRepository;
exports.MockSchoolRepository = MockSchoolRepository = __decorate([
    (0, common_1.Injectable)()
], MockSchoolRepository);
//# sourceMappingURL=mock-school.repository.js.map