import { Validators } from '@angular/forms';
import { FormInputType } from '../../../../shared/components/forms/dynamic-form/enum/form.enum';
import { FormFieldConfig } from '../../../../shared/components/forms/dynamic-form/interfaces/form-config.type';
import { UserRole } from '../../enums/user-role.enum';
import { passwordValidator } from '../../../../shared/validators/password.validator';

export const UserFormConfig: FormFieldConfig[] = [
    {
        type: FormInputType.file,
        controlName: 'profilePicture',
        label: 'Profile Picture',
        placeholder: 'Upload profile picture',
        validators: []
    },
    {
        type: FormInputType.text,
        controlName: 'firstName',
        label: 'First Name',
        placeholder: 'Enter first name',
        validators: [Validators.required],
        errorMessages: { required: 'First Name is required' }
    },
    {
        type: FormInputType.text,
        controlName: 'lastName',
        label: 'Last Name',
        placeholder: 'Enter last name',
        validators: [Validators.required],
        errorMessages: { required: 'Last Name is required' }
    },
    {
        type: FormInputType.email,
        controlName: 'email',
        label: 'Email',
        placeholder: 'Enter email',
        validators: [Validators.required, Validators.email],
        errorMessages: { required: 'Email is required', email: 'Invalid email format' }
    },
    {
        type: FormInputType.password,
        controlName: 'password',
        label: 'Password',
        placeholder: 'Enter password',
        validators: [Validators.required, passwordValidator()],
        errorMessages: { required: 'Password is required', passwordStrength: 'Password is not strong enough' },
        hidden: false
    },
    {
        type: FormInputType.select,
        controlName: 'role',
        label: 'Role',
        placeholder: 'Select role',
        validators: [Validators.required],
        errorMessages: { required: 'Role is required' },
        selectOptions: [
            { label: 'Admin', value: UserRole.ADMIN },
            { label: 'Manager', value: UserRole.MANAGER },
            { label: 'Cashier', value: UserRole.CASHIER }
        ]
    },
    {
        type: FormInputType.number,
        controlName: 'age',
        label: 'Age',
        placeholder: 'Enter age',
        validators: [Validators.min(18)],
        errorMessages: { min: 'User must be at least 18 years old' }
    },
    {
        type: FormInputType.textarea,
        controlName: 'address',
        label: 'Address',
        placeholder: 'Enter address',
        validators: []
    },
];
