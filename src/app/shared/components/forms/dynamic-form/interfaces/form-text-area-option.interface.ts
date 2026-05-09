import { FormInputType } from "../enum/form.enum";
import { BaseFormConfig } from "./base-form-config.interface";

export interface FormTextAreaOption extends BaseFormConfig {
    type: FormInputType.textarea;
    rows?: number;
}
