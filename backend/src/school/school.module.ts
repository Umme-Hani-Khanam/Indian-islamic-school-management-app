import { Module } from '@nestjs/common';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';
import { MockSchoolRepository } from './repositories/mock-school.repository';

@Module({
  controllers: [SchoolController],
  providers: [SchoolService, MockSchoolRepository],
  exports: [MockSchoolRepository],
})
export class SchoolModule {}
