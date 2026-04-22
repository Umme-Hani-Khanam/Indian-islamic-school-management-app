import { Module } from '@nestjs/common';
import { ParentController } from './parent.controller';
import { ParentService } from './parent.service';
import { SchoolModule } from '../school/school.module';

@Module({
  imports: [SchoolModule],
  controllers: [ParentController],
  providers: [ParentService],
})
export class ParentModule {}
