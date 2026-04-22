import { MockSchoolRepository } from '../school/repositories/mock-school.repository';
export declare class ParentService {
    private readonly repository;
    constructor(repository: MockSchoolRepository);
    private getChildOrThrow;
    private ensureChildAccess;
    getDashboard(userId: string): {
        child: {
            id: string;
            name: string;
            rollNumber: string;
        };
        classDetails: import("../school/interfaces/school.interface").Class | undefined;
        attendancePct: number;
        latestMarks: {
            subject: string;
            score: number;
            total: number;
        }[];
        gpa: number;
        ratingScore: number;
        alertsCount: number;
        alerts: import("../school/interfaces/school.interface").Alert[];
        monthlyProgress: import("../school/interfaces/school.interface").MonthlyProgress[];
    };
    getChild(userId: string): import("../school/interfaces/school.interface").StudentProfileResponse;
    getChildPerformance(userId: string): {
        student: import("../school/interfaces/school.interface").Student;
        subjects: {
            subject: import("../school/interfaces/school.interface").Subject;
            marks: import("../school/interfaces/school.interface").Marks[];
        }[];
        dailyPerformance: import("../school/interfaces/school.interface").DailyPerformance[];
        monthlyProgress: import("../school/interfaces/school.interface").MonthlyProgress[];
        positiveRemarks: import("../school/interfaces/school.interface").Remarks[];
        negativeRemarks: import("../school/interfaces/school.interface").Remarks[];
        homework: {
            subject: string;
            total: number;
            completed: number;
            completionPct: number;
            tasks: {
                title: string;
                isCompleted: boolean;
            }[];
        }[];
        assignedTeachers: {
            employeeId: string;
            department: string;
            subject: string;
            performanceScore: number;
            ranking: string | number;
            guidanceEffectiveness: number;
        }[];
    };
    getAlerts(userId: string): import("../school/interfaces/school.interface").Alert[];
}
