import { FormInputType } from "../enum/form.enum";
import { BaseFormConfig } from "./base-form-config.interface";

export interface FileTypeOption extends BaseFormConfig {
    type: FormInputType.file;
    acceptedFileTypes?: string[];
    maxFileSize?: number;
}
