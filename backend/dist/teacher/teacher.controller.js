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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const teacher_service_1 = require("./teacher.service");
const teacher_dto_1 = require("./dto/teacher.dto");
let TeacherController = class TeacherController {
    teacherService;
    constructor(teacherService) {
        this.teacherService = teacherService;
    }
    getDashboard(req) {
        return this.teacherService.getDashboard(req.user.userId);
    }
    getStudents(req) {
        return this.teacherService.getStudents(req.user.userId);
    }
    getStudentDetails(id, req) {
        return this.teacherService.getStudentDetails(req.user.userId, id);
    }
    addMark(dto, req) {
        return this.teacherService.addMark(req.user.userId, dto);
    }
    addRemark(dto, req) {
        return this.teacherService.addRemark(req.user.userId, dto);
    }
};
exports.TeacherController = TeacherController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('students'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "getStudents", null);
__decorate([
    (0, common_1.Get)('student/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "getStudentDetails", null);
__decorate([
    (0, common_1.Post)('marks'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [teacher_dto_1.CreateMarkDto, Object]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "addMark", null);
__decorate([
    (0, common_1.Post)('remarks'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [teacher_dto_1.CreateRemarkDto, Object]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "addRemark", null);
exports.TeacherController = TeacherController = __decorate([
    (0, common_1.Controller)('teacher'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('TEACHER'),
    __metadata("design:paramtypes", [teacher_service_1.TeacherService])
], TeacherController);
//# sourceMappingURL=teacher.controller.js.map