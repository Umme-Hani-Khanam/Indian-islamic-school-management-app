import { MockSchoolRepository } from '../school/repositories/mock-school.repository';
export declare class AlertsService {
    private readonly repository;
    constructor(repository: MockSchoolRepository);
    findAll(userId: string, role: string): Promise<Alert[]>;
    findOne(id: string, userId: string, role: string): Promise<any>;
    create(dto: any, userId: string, role: string): Promise<Alert>;
    update(id: string, update: any, userId: string, role: string): Promise<Alert>;
}
