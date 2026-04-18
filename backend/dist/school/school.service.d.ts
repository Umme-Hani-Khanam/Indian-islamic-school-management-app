import { MockSchoolRepository } from './repositories/mock-school.repository';
import { Class, Student, StudentProfileResponse } from './interfaces/school.interface';
export declare class SchoolService {
    private readonly repository;
    constructor(repository: MockSchoolRepository);
    getClasses(user: any): Class[];
    getStudents(classId: string, user: any): Student[];
    getStudentProfile(studentId: string, user: any): StudentProfileResponse;
}
