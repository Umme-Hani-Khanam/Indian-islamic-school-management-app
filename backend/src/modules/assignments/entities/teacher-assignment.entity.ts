import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ClassEntity } from '../../classes/class.entity';
import { Subject } from '../../subjects/subject.entity';
import { Teacher } from '../../teachers/teacher.entity';

@Entity('teacher_assignments')
export class TeacherAssignment {
  @PrimaryColumn('uuid')
  teacherId: string;

  @PrimaryColumn('uuid')
  classId: string;

  @PrimaryColumn('uuid')
  subjectId: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.assignments, { eager: true })
  @JoinColumn({ name: 'teacherId' })
  teacher: Teacher;

  @ManyToOne(() => ClassEntity, (classEntity) => classEntity.assignments, { eager: true })
  @JoinColumn({ name: 'classId' })
  class: ClassEntity;

  @ManyToOne(() => Subject, (subject) => subject.assignments, { eager: true })
  @JoinColumn({ name: 'subjectId' })
  subject: Subject;
}
