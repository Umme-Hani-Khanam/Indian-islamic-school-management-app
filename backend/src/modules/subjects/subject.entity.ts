import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Mark } from '../marks/entities/mark.entity';
import { TeacherAssignment } from '../assignments/entities/teacher-assignment.entity';

@Entity('subjects')
export class Subject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Mark, (mark) => mark.subject)
  marks: Mark[];

  @OneToMany(() => TeacherAssignment, (assignment) => assignment.subject)
  assignments: TeacherAssignment[];
}
