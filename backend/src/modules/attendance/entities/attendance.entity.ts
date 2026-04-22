import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from '../../students/entities/student.entity';

export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
}

@Entity('attendance')
@Index(['studentId', 'date'])
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  studentId: string;

  @ManyToOne(() => Student, (student) => student.attendanceRecords, { eager: true })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column('date')
  date: string;

  @Column({ type: 'enum', enum: AttendanceStatus })
  status: AttendanceStatus;
}
