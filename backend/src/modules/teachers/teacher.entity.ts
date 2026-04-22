import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TeacherAssignment } from '../assignments/entities/teacher-assignment.entity';
import { Remark } from '../remarks/entities/remark.entity';

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => TeacherAssignment, (assignment) => assignment.teacher)
  assignments: TeacherAssignment[];

  @OneToMany(() => Remark, (remark) => remark.teacher)
  remarks: Remark[];
}
