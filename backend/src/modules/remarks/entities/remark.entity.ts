import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Teacher } from '../../teachers/teacher.entity';

export enum RemarkType {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
}

@Entity('remarks')
@Index(['studentId', 'teacherId', 'date'])
export class Remark {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  studentId: string;

  @ManyToOne(() => Student, (student) => student.remarks, { eager: true })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column('uuid')
  teacherId: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.remarks, { eager: true })
  @JoinColumn({ name: 'teacherId' })
  teacher: Teacher;

  @Column('text')
  comment: string;

  @Column({ type: 'enum', enum: RemarkType })
  type: RemarkType;

  @Column('date')
  date: string;
}
