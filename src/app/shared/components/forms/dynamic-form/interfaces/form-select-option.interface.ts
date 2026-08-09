import { FormInputType } from "../enum/form.enum";
import { BaseFormConfig } from "./base-form-config.interface";

export interface FormSelectOption extends BaseFormConfig {
    type: FormInputType.select;
    selectOptions: { label: string; value: string | number }[];
    searchable?: boolean;
}
