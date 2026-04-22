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
exports.ParentController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const parent_service_1 = require("./parent.service");
let ParentController = class ParentController {
    parentService;
    constructor(parentService) {
        this.parentService = parentService;
    }
    getDashboard(req) {
        return this.parentService.getDashboard(req.user.userId);
    }
    getChild(req) {
        return this.parentService.getChild(req.user.userId);
    }
    getChildPerformance(req) {
        return this.parentService.getChildPerformance(req.user.userId);
    }
    getAlerts(req) {
        return this.parentService.getAlerts(req.user.userId);
    }
};
exports.ParentController = ParentController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ParentController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('child'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ParentController.prototype, "getChild", null);
__decorate([
    (0, common_1.Get)('child/performance'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ParentController.prototype, "getChildPerformance", null);
__decorate([
    (0, common_1.Get)('alerts'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ParentController.prototype, "getAlerts", null);
exports.ParentController = ParentController = __decorate([
    (0, common_1.Controller)('parent'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PARENT'),
    __metadata("design:paramtypes", [parent_service_1.ParentService])
], ParentController);
//# sourceMappingURL=parent.controller.js.map