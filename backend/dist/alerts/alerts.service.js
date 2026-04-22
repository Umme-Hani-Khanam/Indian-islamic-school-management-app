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
exports.AlertsService = void 0;
const common_1 = require("@nestjs/common");
const mock_school_repository_1 = require("../school/repositories/mock-school.repository");
let AlertsService = class AlertsService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async findAll(userId, role) {
        if (role === 'HEADMASTER')
            return this.repository.getAllAlerts();
        if (role === 'TEACHER') {
            const teacher = this.repository.getTeacherByUserId(userId);
            if (!teacher)
                return [];
            const classes = this.repository.getClassesByTeacher(userId);
            const alerts = [];
            for (const cls of classes) {
                alerts.push(...this.repository.getAlertsByClass(cls.id));
            }
            return [...new Set(alerts)];
        }
        if (role === 'PARENT') {
            const children = this.repository.getStudentsByParent(userId);
            const alerts = [];
            for (const child of children) {
                alerts.push(...this.repository.getAlertsByStudent(child.id));
            }
            return alerts;
        }
        throw new common_1.ForbiddenException('Unauthorized role');
    }
    async findOne(id, userId, role) {
        const alert = this.repository.getAlertById(id);
        if (!alert)
            throw new common_1.NotFoundException('Alert not found');
        if (role === 'HEADMASTER')
            return alert;
        if (role === 'PARENT') {
            const children = this.repository.getStudentsByParent(userId);
            if (!children.find(c => c.id === alert.studentId)) {
                throw new common_1.ForbiddenException('Not your child');
            }
            return alert;
        }
        if (role === 'TEACHER') {
            const student = this.repository.getStudentById(alert.studentId);
            if (!student)
                throw new common_1.NotFoundException('Student not found');
            const teacherClasses = this.repository.getClassesByTeacher(userId);
            if (!teacherClasses.find(c => c.id === student.classId)) {
                throw new common_1.ForbiddenException('Student not in your classes');
            }
            return alert;
        }
    }
    async create(dto, userId, role) {
        if (role === 'PARENT') {
            const allowedCategories = ['Medical Support', 'Academic Concern', 'Counseling Request'];
            if (!allowedCategories.some(c => dto.title.includes(c))) {
                throw new common_1.ForbiddenException('Parents can only raise specific support alerts');
            }
            const children = this.repository.getStudentsByParent(userId);
            if (!children.find(c => c.id === dto.studentId)) {
                throw new common_1.ForbiddenException('Unauthorized student ID');
            }
        }
        return this.repository.addAlert({
            ...dto,
            raisedByRole: role,
            createdByUserId: userId,
            status: 'OPEN'
        });
    }
    async update(id, update, userId, role) {
        const alert = await this.findOne(id, userId, role);
        if (role === 'PARENT' && update.status && update.status !== 'OPEN') {
            throw new common_1.ForbiddenException('Parents cannot resolve alerts');
        }
        return this.repository.updateAlert(id, update, userId);
    }
};
exports.AlertsService = AlertsService;
exports.AlertsService = AlertsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mock_school_repository_1.MockSchoolRepository])
], AlertsService);
//# sourceMappingURL=alerts.service.js.map