import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

/**
 * Validates that the input matches the standard high-security password requirements:
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 * @returns {ValidatorFn} The reactive validation closure
 */
export function passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        if (!value) {
            return null;
        }

        const hasUpperCase = /[A-Z]+/.test(value);
        const hasLowerCase = /[a-z]+/.test(value);
        const hasNumber = /[0-9]+/.test(value);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);
        const hasMinLength = value.length >= 8;

        const passwordValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasMinLength;

        return !passwordValid
            ? {
                  passwordStrength: {
                      hasUpperCase,
                      hasLowerCase,
                      hasNumber,
                      hasSpecialChar,
                      hasMinLength,
                  },
              }
            : null;
    };
}
