import { Component, effect, inject, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from '../../../../shared/components/forms/dynamic-form/dynamic-form';
import { MenuFormConfig } from './menu-create.config';
import { MenuFacade } from '../../services/menu.facade';
import { Loading } from '../../../../shared/directives/loading/loading';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Menu } from '../../model/menu.model';

@Component({
    selector: 'app-menu-create',
    imports: [DynamicForm, Loading],
    templateUrl: './menu-create.html',
    styleUrl: './menu-create.component.scss',
})
export class MenuCreate {
    private readonly _dialogRef = inject(DynamicDialogRef);
    private readonly _dialogConfig = inject(DynamicDialogConfig);
    private readonly _facade = inject(MenuFacade);

    menuFormConfig = MenuFormConfig;
    menuForm!: FormGroup;
    isLoading = this._facade.loading;
    isEditMode = signal(false);
    menuId = signal<string | null>(null);

    constructor() {
        effect(() => {
            if (this._facade.closeDialog()) {
                this._facade.resetCloseDialog();
                this._dialogRef.close(true);
            }
        });
    }

    onFormReady(form: FormGroup) {
        this.menuForm = form;

        if (this._dialogConfig.data) {
            this.isEditMode.set(true);
            const data = this._dialogConfig.data as Menu;
            this.menuId.set(data._id);

            this.menuForm.patchValue({
                name: data.name,
                description: data.description,
                isActive: data.isActive,
            });
        }
    }

    onSubmit() {
        if (this.menuForm?.valid) {
            const formValue: Partial<Menu> = { ...this.menuForm.value };

            if (this.isEditMode() && this.menuId()) {
                this._facade.updateMenu(this.menuId()!, formValue);
            } else {
                this._facade.createMenu(formValue);
            }

        } else {
            this.menuForm?.markAllAsTouched();
        }
    }

    onCancel() {
        this._facade.resetCloseDialog();
        this._dialogRef.close();
    }
}
