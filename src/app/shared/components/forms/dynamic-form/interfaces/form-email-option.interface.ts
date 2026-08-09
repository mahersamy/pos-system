import { FormInputType } from "../enum/form.enum";
import { BaseFormConfig } from "./base-form-config.interface";

export interface FormEmailOption extends BaseFormConfig {
    type: FormInputType.email;
}
