"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentService = void 0;
const common_1 = require("@nestjs/common");
const mock_school_repository_1 = require("../school/repositories/mock-school.repository");
const homeworkData = {
    '1': { total: 20, completed: 17 },
};
const teacherScores = {
    '1': 92,
    '2': 88,
};
let ParentService = class ParentService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    getChildOrThrow(userId) {
        const children = this.repository.getStudentsByParent(userId);
        if (!children.length)
            throw new common_1.ForbiddenException('No child linked to this parent account');
        return children[0];
    }
    ensureChildAccess(userId, studentId) {
        const children = this.repository.getStudentsByParent(userId);
        if (!children.find(c => c.id === studentId)) {
            throw new common_1.ForbiddenException('You are not authorized to view this student');
        }
    }
    getDashboard(userId) {
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
    getChild(userId) {
        const child = this.getChildOrThrow(userId);
        return this.repository.getStudentProfile(child.id);
    }
    getChildPerformance(userId) {
        const child = this.getChildOrThrow(userId);
        const profile = this.repository.getStudentProfile(child.id);
        const subjectNames = {};
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
    getAlerts(userId) {
        const child = this.getChildOrThrow(userId);
        const profile = this.repository.getStudentProfile(child.id);
        return profile.alerts;
    }
};
exports.ParentService = ParentService;
exports.ParentService = ParentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mock_school_repository_1.MockSchoolRepository])
], ParentService);
//# sourceMappingURL=parent.service.js.map