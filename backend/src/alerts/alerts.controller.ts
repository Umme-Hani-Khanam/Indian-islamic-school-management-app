import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('alerts')
@UseGuards(JwtAuthGuard)
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  findAll(@Request() req) {
    return this.alertsService.findAll(req.user.userId, req.user.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.alertsService.findOne(id, req.user.userId, req.user.role);
  }

  @Post()
  create(@Body() dto: any, @Request() req) {
    return this.alertsService.create(dto, req.user.userId, req.user.role);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() update: any, @Request() req) {
    return this.alertsService.update(id, update, req.user.userId, req.user.role);
  }
}
