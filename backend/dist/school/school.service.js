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
exports.SchoolService = void 0;
const common_1 = require("@nestjs/common");
const mock_school_repository_1 = require("./repositories/mock-school.repository");
let SchoolService = class SchoolService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    getClasses(user) {
        const { role, sub: userId } = user;
        if (role === 'HEADMASTER') {
            return this.repository.getAllClasses();
        }
        if (role === 'TEACHER') {
            return this.repository.getClassesByTeacher(userId);
        }
        return [];
    }
    getStudents(classId, user) {
        const { role, sub: userId } = user;
        if (role === 'HEADMASTER') {
            return this.repository.getStudentsByClass(classId);
        }
        if (role === 'TEACHER') {
            const students = this.repository.getStudentsByTeacher(userId, classId);
            if (!students.length) {
                throw new common_1.ForbiddenException('You are not authorized to view students for this class');
            }
            return students;
        }
        if (role === 'PARENT') {
            const students = this.repository.getStudentsByParent(userId);
            return students.filter(s => s.classId === classId);
        }
        return [];
    }
    getStudentProfile(studentId, user) {
        const { role, sub: userId } = user;
        if (role === 'TEACHER') {
            const student = this.repository.getStudentById(studentId);
            if (!student)
                throw new common_1.ForbiddenException('Student not found');
            const servesStudent = this.repository.getStudentsByTeacher(userId, student.classId).length > 0;
            if (!servesStudent)
                throw new common_1.ForbiddenException('You are not authorized to view this student profile');
        }
        if (role === 'PARENT') {
            const student = this.repository.getStudentById(studentId);
            if (student?.parentId !== userId) {
                throw new common_1.ForbiddenException('You are not authorized to view this student profile');
            }
        }
        return this.repository.getStudentProfile(studentId);
    }
};
exports.SchoolService = SchoolService;
exports.SchoolService = SchoolService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mock_school_repository_1.MockSchoolRepository])
], SchoolService);
//# sourceMappingURL=school.service.js.map