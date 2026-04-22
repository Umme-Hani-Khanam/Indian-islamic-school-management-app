import { IsDateString, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterAttendanceDto {
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number = 25;
}
