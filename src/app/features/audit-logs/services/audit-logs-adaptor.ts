import { Injectable } from "@angular/core";
import { Adaptor } from "../../../core/base/adaptor.base";
import { AuditLogModel } from "../models/audit-log.model";
import { AuditLogAdaptModel } from "../models/audit-log-adapt.model";

@Injectable({
    providedIn: "root",
})
export class AuditLogsAdaptor implements Adaptor {
    adapt(data: AuditLogModel): AuditLogAdaptModel {
        // performedBy could be an object if populated by backend, or a string ID.
        // We'll try to extract a name if it exists.
        const performedByName = data.performedBy?.firstName ? data.performedBy?.firstName + " " + data.performedBy?.lastName : data.performedBy?.name;
        return {
            _id: data._id,
            action: data.action,
            entity: data.entity,
            performedBy: typeof performedByName === 'string' ? performedByName : JSON.stringify(performedByName),
            ipAddress: data.ipAddress,
            createdAt: data.createdAt,
        };
    }
}
