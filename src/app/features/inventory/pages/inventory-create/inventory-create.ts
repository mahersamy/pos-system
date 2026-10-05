import { Component, effect, inject, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from '../../../../shared/components/forms/dynamic-form/dynamic-form';
import { InventoryFormConfig } from './inventory-create.config';
import { InventoryFacade } from '../../services/inventory.facade';
import { CategoryFacade } from '../../../category/services/category.facade';
import { Loading } from '../../../../shared/directives/loading/loading';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Inventory } from '../../model/inventory.model';
import { FormFieldConfig } from '../../../../shared/components/forms/dynamic-form/interfaces/form-config.type';
import { ProgressSpinner } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-inventory-create',
    imports: [DynamicForm, Loading, ProgressSpinner, CommonModule],
    templateUrl: './inventory-create.html',
    styleUrl: './inventory-create.component.scss',
})
export class InventoryCreate {
    private readonly _dialogRef = inject(DynamicDialogRef);
    private readonly _dialogConfig = inject(DynamicDialogConfig);
    private readonly _facade = inject(InventoryFacade);
    private readonly _categoryFacade = inject(CategoryFacade);

    isLoading = this._facade.loading;
    isEditMode = signal(false);
    inventoryId = signal<string | null>(null);
    inventoryForm!: FormGroup;

    // 🔧 Dynamic form config (category options injected reactively)
    formConfig = signal<FormFieldConfig[]>([...InventoryFormConfig]);

    constructor() {
        // Load category options on init
        this._categoryFacade.loadCategoryOptions();

        // Whenever categoryOptions signal changes, patch the 'category' field's selectOptions
        effect(() => {
            const options = this._categoryFacade.categoryOptions();
            this.formConfig.update((config) =>
                config.map((field) =>
                    field.controlName === 'category'
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

    get categoryOptionsLoading() {
        return this._categoryFacade.categoryOptionsLoading;
    }

    onFormReady(form: FormGroup) {
        this.inventoryForm = form;

        if (this._dialogConfig.data) {
            this.isEditMode.set(true);
            const data = this._dialogConfig.data as Inventory;
            this.inventoryId.set(data._id);

            // Handle case where backend returns populated category object instead of string ID
            const categoryId = data.category && typeof data.category === 'object' && '_id' in data.category
                ? (data.category as any)._id
                : data.category;

            this.inventoryForm.patchValue({
                name: data.name,
                category: categoryId,
                quantity: data.quantity,
                price: data.price,
                stock: data.stock,
                status: data.status,
                perishable: data.perishable,
                // image field shows existing URL as preview
                image: data.image?.secure_url ?? null,
            });
        }
    }

    onSubmit() {
        if (this.inventoryForm?.valid) {
            const formValue: Partial<Inventory> = { ...this.inventoryForm.value };

            // Extract image file — not sent in JSON body
            const imageFile: File | null = formValue.image instanceof File
                ? formValue.image
                : null;
            delete (formValue as any).image;

            if (this.isEditMode() && this.inventoryId()) {
                this._submitUpdate(this.inventoryId()!, formValue, imageFile);
            } else {
                this._submitCreate(formValue, imageFile);
            }
        } else {
            this.inventoryForm?.markAllAsTouched();
        }
    }

    // ─── CREATE ────────────────────────────────────────────────────────────────

    private _submitCreate(formValue: Partial<Inventory>, imageFile: File | null) {
        this._facade.createInventory(formValue, imageFile);
    }

    // ─── UPDATE ────────────────────────────────────────────────────────────────

    private _submitUpdate(id: string, formValue: Partial<Inventory>, imageFile: File | null) {
        this._facade.updateInventory(id, formValue, imageFile);
    }

    onCancel() {
        this._facade.resetCloseDialog();
        this._dialogRef.close();
    }
}
