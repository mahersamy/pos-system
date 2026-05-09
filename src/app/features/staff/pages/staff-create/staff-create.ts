import { Component, inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { DynamicForm } from "../../../../shared/components/forms/dynamic-form/dynamic-form";
import { StaffFormConfig } from "./staff-create.config";
import { DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
    selector: "app-staff-create",
    imports: [DynamicForm],
    templateUrl: "./staff-create.html",
    styleUrl: "./staff-create.scss",
})
export class StaffCreate {
    private readonly _dialogRef = inject(DynamicDialogRef);
    
    staffFormConfig=StaffFormConfig;
    staffForm!: FormGroup;

    onFormReady(form: FormGroup) {
        this.staffForm = form;
        
        // Log initial value
        console.log("Initial staff form value:", this.staffForm.value);
        // Optional: subscribe to value changes and log them
        this.staffForm.valueChanges.subscribe(value => {
            console.log("Staff form updated value:", value);
        });
    }

    onSubmit() {
        if (this.staffForm?.valid) {
            console.log("Form Submitted:", this.staffForm.value);
        } else {
            console.log("Form is invalid");
        }
    }

    onCancel() {
        console.log("Cancel button clicked");
        this._dialogRef.close();
    }
}
