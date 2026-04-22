import { IsDateString, IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateMarkDto {
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @IsUUID()
  @IsNotEmpty()
  subjectId: string;

  @IsNumber()
  @Min(0)
  marks: number;

  @IsDateString()
  @IsNotEmpty()
  date: string;
}
