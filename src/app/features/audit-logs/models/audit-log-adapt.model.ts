export interface AuditLogAdaptModel {
    _id: string;
    action: string;
    entity: string;
    performedBy: string;
    ipAddress?: string;
    createdAt?: string;
}
