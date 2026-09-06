import { Validators } from '@angular/forms';
import { FormInputType } from '../../../../shared/components/forms/dynamic-form/enum/form.enum';
import { FormFieldConfig } from '../../../../shared/components/forms/dynamic-form/interfaces/form-config.type';
import { InventoryStatus, InventoryStock } from '../../enums/inventory.enum';

export const InventoryFormConfig: FormFieldConfig[] = [
    {
        type: FormInputType.file,
        controlName: 'image',
        label: 'Item Image',
        placeholder: 'Upload item image',
        validators: []
    },
    {
        type: FormInputType.text,
        controlName: 'name',
        label: 'Name',
        placeholder: 'Enter inventory name',
        validators: [Validators.required],
        errorMessages: { required: 'Inventory name is required' }
    },
    {
        type: FormInputType.select,
        controlName: 'category',
        label: 'Category',
        placeholder: 'Select a category',
        selectOptions: [], // populated dynamically at runtime
        searchable: true,
        validators: [Validators.required],
        errorMessages: { required: 'Category is required' }
    },
    {
        type: FormInputType.number,
        controlName: 'quantity',
        label: 'Quantity',
        placeholder: 'Enter quantity',
        defaultValue: 0,
        validators: [Validators.required, Validators.min(0)],
        errorMessages: { required: 'Quantity is required', min: 'Quantity cannot be negative' }
    },
    {
        type: FormInputType.number,
        controlName: 'price',
        label: 'Price',
        placeholder: 'Enter price',
        validators: [Validators.required, Validators.min(0)],
        errorMessages: { required: 'Price is required', min: 'Price cannot be negative' }
    },
    {
        type: FormInputType.select,
        controlName: 'stock',
        label: 'Stock Status',
        placeholder: 'Select Stock Status',
        defaultValue: InventoryStock.INSTOCK,
        selectOptions: [
            { label: 'In Stock', value: InventoryStock.INSTOCK },
            { label: 'Low Stock', value: InventoryStock.LOWSTOCK },
            { label: 'Out of Stock', value: InventoryStock.OUTOFSTOCK }
        ],
        validators: [Validators.required],
        errorMessages: { required: 'Stock status is required' }
    },
    {
        type: FormInputType.select,
        controlName: 'status',
        label: 'Status',
        placeholder: 'Select Status',
        defaultValue: InventoryStatus.ACTIVE,
        selectOptions: [
            { label: 'Active', value: InventoryStatus.ACTIVE },
            { label: 'Inactive', value: InventoryStatus.INACTIVE }
        ],
        validators: [Validators.required],
        errorMessages: { required: 'Status is required' }
    },
    {
        type: FormInputType.select,
        controlName: 'perishable',
        label: 'Perishable',
        placeholder: 'Is it perishable?',
        defaultValue: false,
        selectOptions: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
        ],
        validators: [Validators.required],
        errorMessages: { required: 'Perishable flag is required' }
    }
];
