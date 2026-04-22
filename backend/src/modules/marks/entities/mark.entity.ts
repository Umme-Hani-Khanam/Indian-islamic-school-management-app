import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Subject } from '../../subjects/subject.entity';

export enum MarkStatus {
  DRAFT = 'DRAFT',
  FINAL = 'FINAL',
}

@Entity('marks')
@Index(['studentId', 'subjectId', 'date'])
export class Mark {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  studentId: string;

  @ManyToOne(() => Student, (student) => student.marks, { eager: true })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column('uuid')
  subjectId: string;

  @ManyToOne(() => Subject, (subject) => subject.marks, { eager: true })
  @JoinColumn({ name: 'subjectId' })
  subject: Subject;

  @Column('int')
  marks: number;

  @Column('date')
  date: string;
}
