import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UsersApiService } from "./users-api.service";
import { User } from "../model/user.model";
import { BaseFacade } from "../../../core/base/base-facade.base";
import { GetAllModel } from "../../../core/models/get-all.model";

@Injectable({ providedIn: "root" })
export class UsersFacade extends BaseFacade<User> {

    protected readonly _api = inject(UsersApiService);

    // ── BaseFacade hooks ────────────────────────────────────────────────────
    protected _loadApi = (params: GetAllModel) => this._api.getAll(params);
    protected _deleteApi = (id: string) => this._api.delete(id);


    protected override _deleteManyApi(ids: string[]): Observable<any> {
        throw new Error("Method not implemented.");
    }

    // ── Users-unique: change role ─────────────────────────────────────────
    changeRole(id: string, role: string): void {
        this._setLoading(true);
        this._api.changeRole(id, { role }).subscribe({
            next: () => {
                this._setLoading(false);
                this.load();
            },
            error: () => {
                this._setLoading(false);
                this._setError(true);
            },
        });
    }

    
}
