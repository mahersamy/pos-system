import { Injectable } from "@angular/core";
import { BaseState } from "../../../core/base/base-state.base";
import { AuditLogAdaptModel } from "../models/audit-log-adapt.model";

@Injectable({ providedIn: "root" })
export class AuditLogsState extends BaseState<AuditLogAdaptModel> {
    // Add any audit-logs-specific signals here in future
}
