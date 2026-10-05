import { Component, effect, inject, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from '../../../../shared/components/forms/dynamic-form/dynamic-form';
import { CategoryFormConfig } from './category-create.config';
import { CategoryFacade } from '../../services/category.facade';
import { MenuFacade } from '../../../menu/services/menu.facade';
import { Loading } from '../../../../shared/directives/loading/loading';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Category } from '../../model/category.model';
import { FormFieldConfig } from '../../../../shared/components/forms/dynamic-form/interfaces/form-config.type';
import { ProgressSpinner } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { Menu } from '../../../menu/model/menu.model';

@Component({
    selector: 'app-category-create',
    imports: [DynamicForm, Loading, ProgressSpinner, CommonModule],
    templateUrl: './category-create.html',
    styleUrl: './category-create.component.scss',
})
export class CategoryCreate {
    private readonly _dialogRef = inject(DynamicDialogRef);
    private readonly _dialogConfig = inject(DynamicDialogConfig);
    private readonly _facade = inject(CategoryFacade);
    private readonly _menuFacade = inject(MenuFacade);

    isLoading = this._facade.loading;
    isEditMode = signal(false);
    categoryId = signal<string | null>(null);
    categoryForm!: FormGroup;

    // 🔧 Dynamic form config (menu options injected reactively)
    formConfig = signal<FormFieldConfig[]>([...CategoryFormConfig]);

    constructor() {

        // Load menu options on init
        this._menuFacade.loadMenuOptions();

        // Whenever menuOptions signal changes, patch the 'menu' field's selectOptions
        effect(() => {
            const options = this._menuFacade.menuOptions();
            this.formConfig.update((config) =>
                config.map((field) =>
                    field.controlName === 'menu'
                        ? { ...field, selectOptions: options }
                        : field
                )
            );
        });

        // Close dialog when facade signals it
        effect(() => {
            if (this._facade.closeDialog()) {
                this._facade.resetCloseDialog();
                this._dialogRef.close(true);
            }
        });
    }

    get menuOptionsLoading() {
        return this._menuFacade.menuOptionsLoading;
    }

    onFormReady(form: FormGroup) {
        this.categoryForm = form;

        if (this._dialogConfig.data) {
            this.isEditMode.set(true);
            const data = this._dialogConfig.data as Category;
            this.categoryId.set(data._id);

            // Handle case where backend returns populated menu object instead of string ID
            const menuId = data.menu && typeof data.menu === 'object' && '_id' in data.menu
                ? (data.menu as Menu)._id
                : data.menu;

            this.categoryForm.patchValue({
                menu: menuId,
                name: data.name,
                description: data.description,
                isActive: data.isActive,
                // image field shows existing URL as preview
                image: data.image?.secure_url ?? null,
            });
        }
    }

    onSubmit() {
        if (this.categoryForm?.valid) {
            const formValue: Partial<Category> = { ...this.categoryForm.value };

            // Extract image file — not sent in JSON body
            const imageFile: File | null = formValue.image instanceof File
                ? formValue.image
                : null;
            delete (formValue as any).image;

            if (this.isEditMode() && this.categoryId()) {
                this._submitUpdate(this.categoryId()!, formValue, imageFile);
            } else {
                this._submitCreate(formValue, imageFile);
            }
        } else {
            this.categoryForm?.markAllAsTouched();
        }
    }

    // ─── CREATE ────────────────────────────────────────────────────────────────

    private _submitCreate(formValue: Partial<Category>, imageFile: File | null) {
        this._facade.createCategory(formValue, imageFile);
    }

    // ─── UPDATE ────────────────────────────────────────────────────────────────

    private _submitUpdate(id: string, formValue: Partial<Category>, imageFile: File | null) {
        this._facade.updateCategory(id, formValue, imageFile);
    }

    onCancel() {
        this._facade.resetCloseDialog();
        this._dialogRef.close();
    }
}
