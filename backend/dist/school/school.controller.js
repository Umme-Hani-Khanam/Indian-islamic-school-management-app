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
exports.SchoolController = void 0;
const common_1 = require("@nestjs/common");
const school_service_1 = require("./school.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let SchoolController = class SchoolController {
    schoolService;
    constructor(schoolService) {
        this.schoolService = schoolService;
    }
    getClasses(req) {
        return this.schoolService.getClasses(req.user);
    }
    getStudents(id, req) {
        return this.schoolService.getStudents(id, req.user);
    }
    getStudentProfile(id, req) {
        try {
            return this.schoolService.getStudentProfile(id, req.user);
        }
        catch (e) {
            if (e.status === 404) {
                throw new common_1.NotFoundException(e.message);
            }
            throw e;
        }
    }
};
exports.SchoolController = SchoolController;
__decorate([
    (0, common_1.Get)('classes'),
    (0, roles_decorator_1.Roles)('HEADMASTER', 'TEACHER'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SchoolController.prototype, "getClasses", null);
__decorate([
    (0, common_1.Get)('classes/:id/students'),
    (0, roles_decorator_1.Roles)('HEADMASTER', 'TEACHER', 'PARENT'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SchoolController.prototype, "getStudents", null);
__decorate([
    (0, common_1.Get)('students/:id/profile'),
    (0, roles_decorator_1.Roles)('HEADMASTER', 'TEACHER', 'PARENT'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SchoolController.prototype, "getStudentProfile", null);
exports.SchoolController = SchoolController = __decorate([
    (0, common_1.Controller)('school'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [school_service_1.SchoolService])
], SchoolController);
//# sourceMappingURL=school.controller.js.map