import { KeyValuePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-validation-messages',
  standalone: true,
  imports: [KeyValuePipe],
  template: `
    @if (control()?.invalid && control()?.touched && control()?.errors) {
      <small class="text-danger block mt-1">
        @for (error of control()?.errors | keyvalue; track error.key) {
           <span class="block">{{ getErrorMessage(error.key, error.value) }}</span>
        }
      </small>
    }
  `
})
export class ValidationMessagesComponent {
  control = input<AbstractControl | null | undefined>();
  errorMessages = input<Record<string, string | undefined> | undefined>();

  private defaultMessages: Record<string, string> = {
    required: 'This field is required.',
    email: 'Please enter a valid email.',
    minlength: 'Value is too short.',
    maxlength: 'Value is too long.',
    pattern: 'Invalid format.'
  };

  getErrorMessage(errorKey: string, errorValue: any): string {
    const customMessages = this.errorMessages();
    if (customMessages && customMessages[errorKey]) {
      return customMessages[errorKey]!;
    }

    if (errorKey === 'minlength' && errorValue?.requiredLength) {
      return `Minimum length is ${errorValue.requiredLength} characters.`;
    }
    if (errorKey === 'maxlength' && errorValue?.requiredLength) {
      return `Maximum length is ${errorValue.requiredLength} characters.`;
    }

    return this.defaultMessages[errorKey] ?? 'Invalid field.';
  }
}
