import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ClassEntity } from '../../classes/class.entity';
import { User } from '../../users/entities/user.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';
import { Mark } from '../../marks/entities/mark.entity';
import { Remark } from '../../remarks/entities/remark.entity';

@Entity('students')
@Index(['studentId'])
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  studentId: string;

  @Column()
  name: string;

  @Column('uuid')
  classId: string;

  @ManyToOne(() => ClassEntity, (classEntity) => classEntity.students, { eager: true })
  @JoinColumn({ name: 'classId' })
  class: ClassEntity;

  @Column({ nullable: true })
  parentId?: string;

  @ManyToOne(() => User, (user) => user.children, { nullable: true, eager: true })
  @JoinColumn({ name: 'parentId' })
  parent?: User;

  @OneToMany(() => Mark, (mark) => mark.student)
  marks: Mark[];

  @OneToMany(() => Attendance, (attendance) => attendance.student)
  attendanceRecords: Attendance[];

  @OneToMany(() => Remark, (remark) => remark.student)
  remarks: Remark[];
}
