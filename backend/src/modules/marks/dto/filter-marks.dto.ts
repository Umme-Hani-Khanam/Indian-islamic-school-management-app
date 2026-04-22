import { IsDateString, IsEnum, IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterMarksDto {
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
