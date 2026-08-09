import { FormControl, FormGroup } from "@angular/forms";
import { Injectable } from "@angular/core";
import { FormFieldConfig } from "../interfaces/form-config.type";

@Injectable({providedIn: 'root'})
export class DynamicFormFactory {

    createForm(fields: FormFieldConfig[]) {
        const controls: Record<string, FormControl> = {}
        for (const field of fields) {
            if (!field.hidden) {
                const initialValue = field.defaultValue !== undefined ? field.defaultValue : null;
                const isDisabled = field.disabled === true;
                controls[field.controlName] = new FormControl(
                    { value: initialValue, disabled: isDisabled },
                    field.validators
                );
            }
        }

        return new FormGroup(controls)
    }
}

