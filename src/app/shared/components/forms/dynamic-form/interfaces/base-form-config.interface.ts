import { ValidatorFn } from '@angular/forms';

export interface BaseFormConfig {
    controlName: string;
    label: string;
    placeholder?: string;
    validators?: ValidatorFn[];
    // Custom validation messages
    errorMessages?: Record<string, string>;
    // Optional flag to hide the field dynamically
    hidden?: boolean;
    disabled?: boolean;
    defaultValue?: any;
}
