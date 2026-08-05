import { inject, Injectable } from "@angular/core";
import { BACKEND_ROUTE } from "../../../core/constants/backend.route";
import { BaseApiService } from "../../../core/base/base-api.base";
import { AuditLogModel } from "../models/audit-log.model";
import { AuditLogAdaptModel } from "../models/audit-log-adapt.model";
import { AuditLogsAdaptor } from "./audit-logs-adaptor";

@Injectable({
    providedIn: "root",
})
export class AuditLogsApiService extends BaseApiService<AuditLogModel, AuditLogAdaptModel> {
    protected readonly basePath = BACKEND_ROUTE.auditLogs.base;
    protected override readonly adapter = inject(AuditLogsAdaptor);
}
