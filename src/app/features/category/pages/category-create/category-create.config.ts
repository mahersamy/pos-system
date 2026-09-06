import { Validators } from '@angular/forms';
import { FormInputType } from '../../../../shared/components/forms/dynamic-form/enum/form.enum';
import { FormFieldConfig } from '../../../../shared/components/forms/dynamic-form/interfaces/form-config.type';

export const CategoryFormConfig: FormFieldConfig[] = [
    {
        type: FormInputType.file,
        controlName: 'image',
        label: 'Category Image',
        placeholder: 'Upload category image',
        validators: []
    },
    {
        type: FormInputType.select,
        controlName: 'menu',
        label: 'Menu',
        placeholder: 'Select a menu',
        selectOptions: [], // populated dynamically at runtime
        searchable: true,
        validators: [Validators.required],
        errorMessages: { required: 'Menu is required' }
    },
    {
        type: FormInputType.text,
        controlName: 'name',
        label: 'Name',
        placeholder: 'Enter category name',
        validators: [Validators.required],
        errorMessages: { required: 'Category name is required' }
    },
    {
        type: FormInputType.textarea,
        controlName: 'description',
        label: 'Description',
        placeholder: 'Enter category description',
        validators: []
    },
    {
        type: FormInputType.select,
        controlName: 'isActive',
        label: 'Status',
        placeholder: 'Select Status',
        defaultValue: true,
        selectOptions: [
            { label: 'Active', value: true },
            { label: 'Inactive', value: false }
        ],
        validators: [Validators.required],
        errorMessages: { required: 'Status is required' }
    }
];
