import { ValidatorFn } from '@angular/forms';

export interface BaseFormConfig {
    controlName: string;
    label: string;
    placeholder?: string;
    validators?: ValidatorFn[];
    // Custom validation messages
    errorMessages?: {
        required?: string;
        email?: string;
        minlength?: string;
        maxlength?: string;
        pattern?: string;
        custom?: string;
    };
}
