import {CommonModule} from "@angular/common";
import {Component, Input} from "@angular/core";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";

@Component({
    selector: "app-field-validation",
    imports: [CommonModule, ReactiveFormsModule, TranslateModule],
    templateUrl: "./field-validation.html",
    styleUrl: "./field-validation.scss",
})
export class FieldValidation {
    @Input() config: any;
    @Input() parentFormGroup!: FormGroup;

    constructor() {}
}
