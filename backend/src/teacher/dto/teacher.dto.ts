import { IsNotEmpty, IsNumber, IsString, Max, Min, IsIn } from 'class-validator';

export class CreateMarkDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  subjectId: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  marks: number;
}

export class CreateRemarkDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsString()
  @IsIn(['POSITIVE', 'NEGATIVE'])
  type: 'POSITIVE' | 'NEGATIVE';
}
