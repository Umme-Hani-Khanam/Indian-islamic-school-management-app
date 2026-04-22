import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Teacher } from '../../teachers/teacher.entity';

export enum UserRole {
  HEADMASTER = 'HEADMASTER',
  TEACHER = 'TEACHER',
  PARENT = 'PARENT',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ nullable: true })
  studentId?: string;

  @Column({ nullable: true })
  teacherId?: string;

  @OneToMany(() => Student, (student) => student.parent)
  children: Student[];

  @OneToOne(() => Teacher, { nullable: true, eager: true })
  @JoinColumn({ name: 'teacherId' })
  teacherProfile?: Teacher;
}
