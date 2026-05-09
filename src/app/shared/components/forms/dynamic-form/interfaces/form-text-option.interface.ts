import { FormInputType } from "../enum/form.enum";
import { BaseFormConfig } from "./base-form-config.interface";

export interface FormTextOption extends BaseFormConfig {
    type: FormInputType.text;
}
