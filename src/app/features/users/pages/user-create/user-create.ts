import { Component, inject, signal, viewChild } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { forkJoin, Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from '../../../../shared/components/forms/dynamic-form/dynamic-form';
import { UserFormConfig } from './user-create.config';
import { UsersApiService } from '../../services/users-api.service';
import { Loading } from '../../../../shared/directives/loading/loading';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { User, UserPermissions } from '../../model/user.model';
import { PermissionEditor } from '../../components/permission-editor/permission-editor';
import { CommonModule } from '@angular/common';
import { GlobalResponse } from '../../../../core/models/response-global.model';

@Component({
    selector: 'app-user-create',
    imports: [DynamicForm, Loading, PermissionEditor, CommonModule],
    templateUrl: './user-create.html',
    styleUrl: './user-create.scss',
})
export class UserCreate {
    private readonly _dialogRef = inject(DynamicDialogRef);
    private readonly _dialogConfig = inject(DynamicDialogConfig);
    private readonly _usersApiService = inject(UsersApiService);

    readonly permEditor = viewChild(PermissionEditor);

    userFormConfig = UserFormConfig.map(field => ({ ...field }));
    userForm!: FormGroup;
    isLoading = signal(false);
    isEditMode = signal(false);
    userId = signal<string | null>(null);

    /** Holds live permissions state as the user toggles */
    currentPermissions = signal<UserPermissions>({});
    /** Permissions from the server for initial display */
    initialPermissions = signal<UserPermissions | undefined>(undefined);
    /** Whether the permissions panel is expanded */
    permPanelOpen = signal(false);

    constructor() {
        if (this._dialogConfig.data) {
            this.isEditMode.set(true);
        }

        const passwordField = this.userFormConfig.find(f => f.controlName === 'password');
        if (passwordField) {
            passwordField.hidden = this.isEditMode();
            // UUID lacks uppercase letters by default. Appending 'A!1' guarantees it passes the strong password validator.
            passwordField.defaultValue = uuidv4() + 'A!1';
        }
    }

    onFormReady(form: FormGroup) {
        this.userForm = form;

        if (this._dialogConfig.data) {
            const data = this._dialogConfig.data as User;
            this.userId.set(data._id);

            this.userForm.patchValue({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                role: data.role,
                age: data.age,
                address: data.address,
                profilePicture: data.profilePicture
            });

            // Load existing permissions
            if (data.permissions) {
                this.initialPermissions.set(data.permissions);
                this.currentPermissions.set({ ...data.permissions });
            }
        }
    }

    onPermissionsChange(perms: UserPermissions) {
        this.currentPermissions.set(perms);
    }

    togglePermPanel() {
        this.permPanelOpen.update(v => !v);
    }

    onSubmit() {
        if (this.userForm?.valid) {
            const formValue = { ...this.userForm.value };

            // Extract image file (not sent in JSON body)
            const imageFile: File | null = formValue.profilePicture instanceof File
                ? formValue.profilePicture
                : null;
            delete formValue.profilePicture;

            if (this.isEditMode() && this.userId()) {
                this._submitUpdate(formValue, imageFile);
            } else {
                this._submitCreate(formValue);
            }
        } else {
            this.userForm?.markAllAsTouched();
        }
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────

    /** Single POST — include permissions in the body */
    private _submitCreate(formValue: any) {
        const perms = this.permEditor()?.getCurrentPermissions();
        if (perms && Object.keys(perms).length > 0) {
            formValue.permissions = perms;
        }

        this.isLoading.set(true);
        this._usersApiService.createUser(formValue).subscribe({
            next: () => {
                this.isLoading.set(false);
                this._dialogRef.close(true);
            },
            error: () => this.isLoading.set(false),
        });
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────

    /**
     * Fires up to 3 separate PATCH calls in parallel via forkJoin.
     *
     * Backend endpoints:
     *   PATCH /:id             → basic info  (OmitType: no role, no password)
     *   PATCH /:id/role        → role only
     *   PATCH /:id/permissions → full permissions map
     */
    private _submitUpdate(formValue: any, _imageFile: File | null) {
        const id = this.userId()!;
        const calls: Observable<GlobalResponse<User>>[] = [];

        // Destructure to separate concerns
        const { role, ...basicInfo } = formValue;

        // ── 1. Basic info
        calls.push(this._usersApiService.updateUser(id, basicInfo));

        // ── 2. Role (always send — backend is idempotent)
        if (role) {
            calls.push(this._usersApiService.changeRole(id, { role }));
        }

        // ── 3. Permissions (from the permission editor)
        const perms = this.permEditor()?.getCurrentPermissions();
        if (perms && Object.keys(perms).length > 0) {
            calls.push(this._usersApiService.updatePermissions(id, perms));
        }

        this.isLoading.set(true);
        forkJoin(calls).subscribe({
            next: () => {
                this.isLoading.set(false);
                this._dialogRef.close(true);
            },
            error: () => this.isLoading.set(false),
        });
    }

    onCancel() {
        this._dialogRef.close();
    }
}
