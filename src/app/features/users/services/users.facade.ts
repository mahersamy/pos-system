import { inject, Injectable, signal } from "@angular/core";
import { forkJoin, Observable, of, throwError } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { UsersApiService } from "./users-api.service";
import { User, UserPermissions } from "../model/user.model";
import { BaseFacade } from "../../../core/base/base-facade.base";
import { GetAllModel } from "../../../core/models/get-all.model";

@Injectable({ providedIn: "root" })
export class UsersFacade extends BaseFacade<User> {

    protected readonly _api = inject(UsersApiService);

    // ── BaseFacade hooks ────────────────────────────────────────────────────
    protected _loadApi = (params: GetAllModel) => this._api.getAll(params);
    protected _deleteApi = (id: string) => this._api.delete(id);

    closeDialog = signal<boolean>(false)


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
                this.closeDialog.set(true);
            },
            error: () => {
                this._setLoading(false);
                this._setError(true);
            },
        });
    }

    // ── Users-unique: Writes (Exposed for UserCreate) ──────────────────────
    createUser(payload: Partial<User>, imageFile: File | null) {
        this._setLoading(true);


        this._api.create(payload).subscribe({
            next: () => {
                this._setLoading(false);
                this.load();
                this.closeDialog.set(true);
            },
            error: () => {
                this._setLoading(false);
                this._setError(true);
            },
        });
    }

    updateUser(id: string, payload: Partial<User>) {
        this._setLoading(true);


        return this._api.update(id, payload).subscribe({
            next: () => {
                this._setLoading(false);
                this.load();
                this.closeDialog.set(true);
            },
            error: () => {
                this._setLoading(false);
                this._setError(true);
            },
        });
    }

    updateRole(id: string, role: string) {
        this._setLoading(true);


        return this._api.changeRole(id, { role }).subscribe({
            next: () => {
                this._setLoading(false);
                this.load();
                this.closeDialog.set(true);
            },
            error: () => {
                this._setLoading(false);
                this._setError(true);
            },
        })
    }

    updatePermissions(id: string, perms: UserPermissions) {
        this._setLoading(true);


        return this._api.updatePermissions(id, perms).subscribe({
            next: () => {
                this._setLoading(false);
                this.load();
                this.closeDialog.set(true);
            },
            error: () => {
                this._setLoading(false);
                this._setError(true);
            },
        })
    }

    uploadUserImage(id: string, image: File) {
        this._setLoading(true);


        return this._api.uploadImage(id, image).subscribe({
            next: () => {
                this._setLoading(false);
                this.load();
                this.closeDialog.set(true);
            },
            error: () => {
                this._setLoading(false);
                this._setError(true);
            },
        })
    }
}
