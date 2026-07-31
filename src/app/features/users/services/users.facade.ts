import { inject, Injectable } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { UsersApiService } from "./users-api.service";
import { User, UserPermissions } from "../model/user.model";
import { BaseFacade } from "../../../core/base/base-facade.base";
import { Observable } from "rxjs";
import { GetAllModel } from "../../../core/models/get-all.model";
import { GlobalResponse } from "../../../core/models/response-global.model";
import { UsersState } from "../state/users.state";

@Injectable({ providedIn: "root" })
export class UsersFacade extends BaseFacade<User> {
    protected override readonly _state = inject(UsersState);
    private readonly _api = inject(UsersApiService);

    // ── BaseFacade hooks ─────────────────────────────────────────────────────
    protected override _loadApi(params: GetAllModel): Observable<User[]> {
        return this._api.getAll(params);
    }



    protected override _deleteApi(id: string): Observable<GlobalResponse> {
        return this._api.delete(id);
    }

    // ── Users-unique: change role ─────────────────────────────────────────
    changeRole(id: string, role: string): void {
        this._state.setLoading(true);
        this._state.setError(false);
        this._api.changeRole(id, { role })
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: () => {
                    this._state.setLoading(false);
                    this._state.setCloseDialog(true);
                },
                error: () => {
                    this._state.setLoading(false);
                    this._state.setError(true);
                },
            });
    }

    // ── Users-unique: Writes ──────────────────────────────────────────────
    createUser(payload: Partial<User>, imageFile: File | null) {
        this._state.setLoading(true);
        this._state.setError(false);

        this._api.create(payload)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: () => {
                    this._state.setLoading(false);
                    this._state.setCloseDialog(true);
                },
                error: () => {
                    this._state.setLoading(false);
                    this._state.setError(true);
                },
            });
    }

    updateUser(id: string, payload: Partial<User>) {
        this._state.setLoading(true);
        this._state.setError(false);

        return this._api.update(id, payload)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: () => {
                    this._state.setLoading(false);
                    this._state.setCloseDialog(true);
                },
                error: () => {
                    this._state.setLoading(false);
                    this._state.setError(true);
                },
            });
    }

    updateRole(id: string, role: string) {
        this._state.setLoading(true);
        this._state.setError(false);

        return this._api.changeRole(id, { role })
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: () => {
                    this._state.setLoading(false);
                    this._state.setCloseDialog(true);
                },
                error: () => {
                    this._state.setLoading(false);
                    this._state.setError(true);
                },
            });
    }

    updatePermissions(id: string, perms: UserPermissions) {
        this._state.setLoading(true);
        this._state.setError(false);

        return this._api.updatePermissions(id, perms)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: () => {
                    this._state.setLoading(false);
                    this._state.setCloseDialog(true);
                },
                error: () => {
                    this._state.setLoading(false);
                    this._state.setError(true);
                },
            });
    }

    uploadUserImage(id: string, image: File) {
        this._state.setLoading(true);
        this._state.setError(false);

        return this._api.uploadImage(id, image)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: () => {
                    this._state.setLoading(false);
                    this._state.setCloseDialog(true);
                },
                error: () => {
                    this._state.setLoading(false);
                    this._state.setError(true);
                },
            });
    }
}
