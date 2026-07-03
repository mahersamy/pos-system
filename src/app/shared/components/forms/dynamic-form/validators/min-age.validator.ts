import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minAgeValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const birthDate = new Date(control.value);
    if (isNaN(birthDate.getTime())) {
      return { invalidDate: true };
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Decrease age by 1 if the birth month hasn't occurred yet this year, 
    // or if it's the birth month but the birth day hasn't occurred yet
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < minAge) {
      return { minAge: { requiredAge: minAge, actualAge: age } };
    }

    return null;
  };
}
