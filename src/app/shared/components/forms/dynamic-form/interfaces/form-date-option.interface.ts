import { FormInputType } from "../enum/form.enum";
import { BaseFormConfig } from "./base-form-config.interface";

export interface FormDateOption extends BaseFormConfig {
    type: FormInputType.date;
    dateFormat?: string;
}
