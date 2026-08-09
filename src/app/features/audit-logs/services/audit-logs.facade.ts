import { inject, Injectable } from "@angular/core";
import { AuditLogsApiService } from "./audit-logs-api.service";
import { AuditLogAdaptModel } from "../models/audit-log-adapt.model";
import { BaseFacade } from "../../../core/base/base-facade.base";
import { GetAllModel } from "../../../core/models/get-all.model";
import { AuditLogsState } from "../state/audit-logs.state";
import { of } from "rxjs";

@Injectable({ providedIn: "root" })
export class AuditLogsFacade extends BaseFacade<AuditLogAdaptModel> {
    protected override readonly _state = inject(AuditLogsState);
    protected readonly _api = inject(AuditLogsApiService);

    // ── BaseFacade hooks ────────────────────────────────────────────────────
    protected _loadApi = (params: GetAllModel) => this._api.getAll(params);
    // Audit logs are read-only, so we disable deletion by returning a dummy observable.
    protected _deleteApi = (id: string) => of({} as any);
    protected _deleteManyApi = (ids: string[]) => of({} as any);
}
