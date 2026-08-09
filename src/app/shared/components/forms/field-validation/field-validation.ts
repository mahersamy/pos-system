import {CommonModule} from "@angular/common";
import {Component, input} from "@angular/core";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";

@Component({
    selector: "app-field-validation",
    imports: [CommonModule, ReactiveFormsModule, TranslateModule],
    templateUrl: "./field-validation.html",
    styleUrl: "./field-validation.scss",
})
export class FieldValidation {
    /** Configuration mapping structure matching form control errors to messages */
    config = input<any>();

    /** Base FormGroup to parse relative states against */
    parentFormGroup = input.required<FormGroup>();
}
