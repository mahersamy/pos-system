import { Validators } from '@angular/forms';
import { FormInputType } from '../../../../shared/components/forms/dynamic-form/enum/form.enum';
import { FormFieldConfig } from '../../../../shared/components/forms/dynamic-form/interfaces/form-config.type';

export const MenuFormConfig: FormFieldConfig[] = [
    {
        type: FormInputType.text,
        controlName: 'name',
        label: 'Name',
        placeholder: 'Enter menu name',
        validators: [Validators.required],
        errorMessages: { required: 'Menu name is required' }
    },
    {
        type: FormInputType.textarea,
        controlName: 'description',
        label: 'Description',
        placeholder: 'Enter menu description',
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
