import { AlertsService } from './alerts.service';
export declare class AlertsController {
    private readonly alertsService;
    constructor(alertsService: AlertsService);
    findAll(req: any): Promise<Alert[]>;
    findOne(id: string, req: any): Promise<any>;
    create(dto: any, req: any): Promise<Alert>;
    update(id: string, update: any, req: any): Promise<Alert>;
}
