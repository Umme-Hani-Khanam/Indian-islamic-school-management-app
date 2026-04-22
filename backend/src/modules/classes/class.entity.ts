import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from '../students/entities/student.entity';
import { TeacherAssignment } from '../assignments/entities/teacher-assignment.entity';

@Entity('classes')
export class ClassEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  section: string;

  @OneToMany(() => Student, (student) => student.class)
  students: Student[];

  @OneToMany(() => TeacherAssignment, (assignment) => assignment.class)
  assignments: TeacherAssignment[];
}
