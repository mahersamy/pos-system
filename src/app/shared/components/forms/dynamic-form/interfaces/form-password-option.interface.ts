import { FormInputType } from "../enum/form.enum";
import { BaseFormConfig } from "./base-form-config.interface";

export interface FormPasswordOption extends BaseFormConfig {
    type: FormInputType.password;
    /** Show password strength feedback bar. Default: false */
    feedback?: boolean;
    /** Show eye icon to toggle visibility. Default: true */
    toggleMask?: boolean;
}
