import { FormInputType } from "../enum/form.enum";
import { BaseFormConfig } from "./base-form-config.interface";

export interface FormTimeOption extends BaseFormConfig {
    type: FormInputType.time;
    timeOnly?: boolean;
}
