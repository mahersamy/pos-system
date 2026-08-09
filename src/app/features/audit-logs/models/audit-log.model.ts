export interface AuditLogModel {
    _id: string;
    action: string;
    entity: string;
    entityId: string;
    performedBy: any;
    oldValue?: any;
    newValue?: any;
    ipAddress?: string;
    userAgent?: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}
