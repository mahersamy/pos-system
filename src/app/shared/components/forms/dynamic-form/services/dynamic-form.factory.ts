import { FormControl, FormGroup } from "@angular/forms";
import { Injectable } from "@angular/core";
import { FormFieldConfig } from "../interfaces/form-config.type";

@Injectable({providedIn: 'root'})
export class DynamicFormFactory {

    createForm(fields: FormFieldConfig[]) {
        const controls: Record<string, FormControl> = {}
        for (const field of fields) {
            controls[field.controlName] = new FormControl(null,field.validators)
        }

        return new FormGroup(controls)
    }
}

