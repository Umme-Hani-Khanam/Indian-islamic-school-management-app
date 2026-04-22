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
exports.TeacherService = void 0;
const common_1 = require("@nestjs/common");
const mock_school_repository_1 = require("../school/repositories/mock-school.repository");
let TeacherService = class TeacherService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    getTeacherOrThrow(userId) {
        const teacher = this.repository.getTeacherByUserId(userId);
        if (!teacher)
            throw new common_1.ForbiddenException('Teacher profile not found');
        return teacher;
    }
    ensureStudentAssigned(teacherUserId, studentId) {
        const teacher = this.getTeacherOrThrow(teacherUserId);
        const student = this.repository.getStudentById(studentId);
        if (!student)
            throw new common_1.ForbiddenException('Student not found');
        const assignedStudents = this.repository.getStudentsByTeacher(teacherUserId, student.classId);
        if (!assignedStudents.find(s => s.id === studentId)) {
            throw new common_1.ForbiddenException('You are not authorized to access this student');
        }
        return { teacher, student };
    }
    getDashboard(userId) {
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
    getStudents(userId) {
        const classes = this.repository.getClassesByTeacher(userId);
        const assignedStudents = [];
        for (const c of classes) {
            const studentsInClass = this.repository.getStudentsByTeacher(userId, c.id);
            assignedStudents.push(...studentsInClass);
        }
        return assignedStudents;
    }
    getStudentDetails(userId, studentId) {
        this.ensureStudentAssigned(userId, studentId);
        return this.repository.getStudentProfile(studentId);
    }
    addMark(userId, dto) {
        const { teacher } = this.ensureStudentAssigned(userId, dto.studentId);
        return this.repository.addMark(dto.studentId, dto.subjectId, teacher.id, dto.marks);
    }
    addRemark(userId, dto) {
        const { teacher } = this.ensureStudentAssigned(userId, dto.studentId);
        return this.repository.addRemark(dto.studentId, teacher.id, dto.comment, dto.type);
    }
};
exports.TeacherService = TeacherService;
exports.TeacherService = TeacherService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mock_school_repository_1.MockSchoolRepository])
], TeacherService);
//# sourceMappingURL=teacher.service.js.map