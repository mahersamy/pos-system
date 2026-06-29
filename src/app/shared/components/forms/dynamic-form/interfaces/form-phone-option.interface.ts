import { FormInputType } from "../enum/form.enum";
import { BaseFormConfig } from "./base-form-config.interface";

export interface FormPhoneOption extends BaseFormConfig {
    type: FormInputType.phone;
    maxLength?: number;
    minLength?: number;
}
