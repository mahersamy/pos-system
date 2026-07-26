import { Component, inject, signal, viewChild } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { forkJoin, Observable, switchMap, of, catchError, map } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from '../../../../shared/components/forms/dynamic-form/dynamic-form';
import { UserFormConfig } from './user-create.config';
import { UsersApiService } from '../../services/users-api.service';
import { Loading } from '../../../../shared/directives/loading/loading';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { User, UserPermissions } from '../../model/user.model';
import { PermissionEditor } from '../../components/permission-editor/permission-editor';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';


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
    private readonly _messageService = inject(MessageService);

    readonly permEditor = viewChild(PermissionEditor);

    userFormConfig = UserFormConfig.map(field => ({ ...field }));
    userForm!: FormGroup;
    isLoading = signal(false);
    isEditMode = signal(false);
    userId = signal<string | null>(null);

    /** Original user data — used to diff what actually changed on update */
    private _originalUser: User | null = null;

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
            this._originalUser = data;

            this.userForm.patchValue({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                role: data.role,
                age: data.age,
                address: data.address,
                profilePicture: typeof data.profilePicture === 'object' && data.profilePicture?.secure_url 
                    ? data.profilePicture.secure_url 
                    : data.profilePicture
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
                this._submitCreate(formValue, imageFile);
            }
        } else {
            this.userForm?.markAllAsTouched();
        }
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────

    /** Single POST — include permissions in the body, then upload image if provided */
    private _submitCreate(formValue: any, imageFile: File | null) {
        const perms = this.permEditor()?.getCurrentPermissions();
        if (perms && Object.keys(perms).length > 0) {
            formValue.permissions = perms;
        }

        this.isLoading.set(true);
        this._usersApiService.createUser(formValue).pipe(
            switchMap((response) => {
                const newId = response.data?._id;
                if (imageFile && newId) {
                    return this._usersApiService.uploadImage(newId, imageFile);
                }
                return of(void 0);
            })
        ).subscribe({
            next: () => {
                this.isLoading.set(false);
                this._dialogRef.close(true);
            },
            error: () => this.isLoading.set(false),
        });
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────

    /**
     * Only fires API calls for sections that actually changed.
     * Independent execution ensures one failure doesn't block other updates.
     */
    private _submitUpdate(formValue: any, imageFile: File | null) {
        const id = this.userId()!;
        const orig = this._originalUser;
        const calls: Observable<{ operation: string, result: 'success' | 'error', error?: any }>[] = [];

        // Helper to format independent observable results
        const mapToResult = (operation: string, obs: Observable<any>) => 
            obs.pipe(
                map(() => ({ operation, result: 'success' as const })),
                catchError((error) => of({ operation, result: 'error' as const, error }))
            );

        // Destructure to separate concerns
        const { role, ...basicInfo } = formValue;

        // ── 1. Basic info — only if any field changed
        const basicInfoChanged = !orig ||
            basicInfo.firstName !== orig.firstName ||
            basicInfo.lastName !== orig.lastName ||
            basicInfo.email !== orig.email ||
            basicInfo.age !== orig.age ||
            basicInfo.address !== orig.address ||
            basicInfo.phoneNumber !== orig.phoneNumber;

        if (basicInfoChanged) {
            calls.push(mapToResult('Basic Info update', this._usersApiService.updateUser(id, basicInfo)));
        }

        // ── 2. Role — only if it changed
        const roleChanged = !orig || role !== orig.role;
        if (role && roleChanged) {
            calls.push(mapToResult('Role update', this._usersApiService.changeRole(id, { role })));
        }

        // ── 3. Permissions — only if they changed
        const perms = this.permEditor()?.getCurrentPermissions();
        const permsChanged = perms &&
            Object.keys(perms).length > 0 &&
            JSON.stringify(perms) !== JSON.stringify(orig?.permissions ?? {});

        if (permsChanged) {
            calls.push(mapToResult('Permissions update', this._usersApiService.updatePermissions(id, perms!)));
        }

        // ── 4. Image — only if a new file was selected
        if (imageFile) {
            calls.push(mapToResult('Profile Image update', this._usersApiService.uploadImage(id, imageFile)));
        }

        // Nothing changed — close without any request
        if (calls.length === 0) {
            this._dialogRef.close(false);
            return;
        }

        this.isLoading.set(true);
        forkJoin(calls).subscribe({
            next: (results) => {
                this.isLoading.set(false);
                
                const failures = results.filter(r => r.result === 'error');
                
                if (failures.length === 0) {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'User information updated successfully.'
                    });
                    this._dialogRef.close(true);
                } else {
                    const failList = failures.map(f => `• ${f.operation}`).join('\n');
                    this._messageService.add({
                        severity: 'warn',
                        summary: 'Partial Update',
                        detail: `The following operations failed:\n${failList}`,
                        life: 5000
                    });
                    // Still close the dialog since some things might have succeeded, 
                    // or user can choose to leave it open. For now, close and refresh.
                    this._dialogRef.close(true);
                }
            },
            error: () => {
                // Should not reach here due to catchError in mapToResult
                this.isLoading.set(false);
            },
        });
    }

    onCancel() {
        this._dialogRef.close();
    }
}
