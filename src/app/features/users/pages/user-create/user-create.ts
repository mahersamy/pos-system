import { Component, inject, signal, viewChild, effect } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from '../../../../shared/components/forms/dynamic-form/dynamic-form';
import { UserFormConfig } from './user-create.config';
import { Loading } from '../../../../shared/directives/loading/loading';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { User, UserPermissions } from '../../model/user.model';
import { PermissionEditor } from '../../components/permission-editor/permission-editor';
import { CommonModule } from '@angular/common';
import { UsersFacade } from '../../services/users.facade';


@Component({
    selector: 'app-user-create',
    imports: [DynamicForm, Loading, PermissionEditor, CommonModule],
    templateUrl: './user-create.html',
    styleUrl: './user-create.scss',
})
export class UserCreate {
    private readonly _dialogRef = inject(DynamicDialogRef);
    private readonly _dialogConfig = inject(DynamicDialogConfig);
    private readonly _facade = inject(UsersFacade);

    readonly permEditor = viewChild(PermissionEditor);

    userFormConfig = UserFormConfig.map(field => ({ ...field }));
    userForm!: FormGroup;
    isLoading = this._facade.loading;
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

        effect(() => {
            if (this._facade.closeDialog()) {
                this.onCancel();
            }
        });
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
            const formValue: Partial<User> = { ...this.userForm.value };

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
    private _submitCreate(formValue: Partial<User>, imageFile: File | null) {
        this._facade.createUser(formValue, imageFile)
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────

    /**
     * Only fires API calls for sections that actually changed.
     * Independent execution ensures one failure doesn't block other updates.
     */
    private _submitUpdate(formValue: Partial<User>, imageFile: File | null) {
        const id = this.userId()!;
        const orig = this._originalUser;

        // Destructure to separate concerns
        const { role, ...basicInfo } = formValue;


        // ── 1. Basic info — only if any field changed
        const basicInfoChanged = !orig ||
            basicInfo.firstName !== orig.firstName ||
            basicInfo.lastName !== orig.lastName ||
            basicInfo.email !== orig.email ||
            basicInfo.age !== orig.age ||
            basicInfo.address !== orig.address;

        if (basicInfoChanged) {
            this._facade.updateUser(id, basicInfo);
        }

        // ── 2. Role — only if it changed
        const roleChanged = !orig || role !== orig.role;
        if (role && roleChanged) {
            this._facade.updateRole(id, role);
        }

        // ── 3. Permissions — only if they changed
        const perms = this.currentPermissions();
        const permsChanged = perms &&
            Object.keys(perms).length > 0 &&
            JSON.stringify(perms) !== JSON.stringify(orig?.permissions ?? {});

        if (permsChanged) {
            this._facade.updatePermissions(id, perms!);
        }

        // ── 4. Image — only if a new file was selected
        if (imageFile) {
            this._facade.uploadUserImage(id, imageFile);
        }
        if (!basicInfoChanged && !roleChanged && !permsChanged && !imageFile) {
            this.onCancel();
        }
    }

    onCancel() {
        this._facade.resetCloseDialog();
        this._dialogRef.close();
    }
}
