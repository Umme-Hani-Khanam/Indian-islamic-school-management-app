import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ParentService } from './parent.service';

@Controller('parent')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PARENT')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Get('dashboard')
  getDashboard(@Request() req) {
    return this.parentService.getDashboard(req.user);
  }

  @Get('child')
  getChild(@Request() req) {
    return this.parentService.getChild(req.user);
  }

  @Get('child/performance')
  getChildPerformance(@Request() req) {
    return this.parentService.getChildPerformance(req.user);
  }

  @Get('alerts')
  getAlerts(@Request() req) {
    return this.parentService.getAlerts(req.user);
  }
}
