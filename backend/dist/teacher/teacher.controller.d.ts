import { TeacherService } from './teacher.service';
import { CreateMarkDto, CreateRemarkDto } from './dto/teacher.dto';
export declare class TeacherController {
    private readonly teacherService;
    constructor(teacherService: TeacherService);
    getDashboard(req: any): {
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
    getStudents(req: any): any[];
    getStudentDetails(id: string, req: any): import("../school/interfaces/school.interface").StudentProfileResponse;
    addMark(dto: CreateMarkDto, req: any): import("../school/interfaces/school.interface").Marks;
    addRemark(dto: CreateRemarkDto, req: any): import("../school/interfaces/school.interface").Remarks;
}
