import { FileTypeOption } from "./file-type-option.interface";
import { FormDateOption } from "./form-date-option.interface";
import { FormNumberOption } from "./form-number-option.interface";
import { FormSelectOption } from "./form-select-option.interface";
import { FormTextAreaOption } from "./form-text-area-option.interface";
import { FormTextOption } from "./form-text-option.interface";
import { FormEmailOption } from "./form-email-option.interface";
import { FormPhoneOption } from "./form-phone-option.interface";
import { FormPasswordOption } from "./form-password-option.interface";
import { FormTimeOption } from "./form-time-option.interface";

export * from './base-form-config.interface';
export * from './form-select-option.interface';
export * from './form-date-option.interface';
export * from './form-number-option.interface';
export * from './file-type-option.interface';
export * from './form-text-area-option.interface';
export * from './form-text-option.interface';
export * from './form-email-option.interface';
export * from './form-phone-option.interface';
export * from './form-password-option.interface';
export * from './form-time-option.interface';

export type FormFieldConfig =
  | FormTextOption
  | FormEmailOption
  | FormPhoneOption
  | FormPasswordOption
  | FormSelectOption
  | FormTextAreaOption
  | FormDateOption
  | FileTypeOption
  | FormTimeOption
  | FormNumberOption;
