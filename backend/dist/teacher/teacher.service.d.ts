import { MockSchoolRepository } from '../school/repositories/mock-school.repository';
import { CreateMarkDto, CreateRemarkDto } from './dto/teacher.dto';
export declare class TeacherService {
    private readonly repository;
    constructor(repository: MockSchoolRepository);
    private getTeacherOrThrow;
    private ensureStudentAssigned;
    getDashboard(userId: string): {
        teacher: import("../school/interfaces/school.interface").Teacher;
        classes: import("../school/interfaces/school.interface").Class[];
        summary: {
            totalClasses: number;
            totalStudents: number;
            averageGrowth: string;
            teacherScore: number;
            teacherRanking: string;
            feedbackScore: string;
        };
        pendingItems: string[];
    };
    getStudents(userId: string): any[];
    getStudentDetails(userId: string, studentId: string): import("../school/interfaces/school.interface").StudentProfileResponse;
    addMark(userId: string, dto: CreateMarkDto): import("../school/interfaces/school.interface").Marks;
    addRemark(userId: string, dto: CreateRemarkDto): import("../school/interfaces/school.interface").Remarks;
}
