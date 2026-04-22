import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { SchoolModule } from '../school/school.module';

@Module({
  imports: [SchoolModule],
  providers: [AlertsService],
  controllers: [AlertsController],
})
export class AlertsModule {}
