import { SchoolService } from './school.service';
export declare class SchoolController {
    private readonly schoolService;
    constructor(schoolService: SchoolService);
    getClasses(req: any): import("./interfaces/school.interface").Class[];
    getStudents(id: string, req: any): import("./interfaces/school.interface").Student[];
    getStudentProfile(id: string, req: any): import("./interfaces/school.interface").StudentProfileResponse;
}
