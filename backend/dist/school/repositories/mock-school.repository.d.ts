import { Class, Student, StudentProfileResponse } from '../interfaces/school.interface';
export declare class MockSchoolRepository {
    private classes;
    private students;
    private teachers;
    private subjects;
    private assignments;
    private attendance;
    private marks;
    private remarks;
    getAllClasses(): Class[];
    getClassesByTeacher(userId: string): Class[];
    getClassById(classId: string): Class | undefined;
    getStudentsByClass(classId: string): Student[];
    getStudentsByTeacher(userId: string, classId: string): Student[];
    getStudentsByParent(parentId: string): Student[];
    getStudentById(studentId: string): Student | undefined;
    getStudentProfile(studentId: string): StudentProfileResponse;
}
