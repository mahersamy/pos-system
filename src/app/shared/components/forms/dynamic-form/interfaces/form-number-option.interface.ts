import { FormInputType } from "../enum/form.enum";
import { BaseFormConfig } from "./base-form-config.interface";

export interface FormNumberOption extends BaseFormConfig {
    type: FormInputType.number;
    min?: number;
    max?: number;
    step?: number;
}
