import { Component, inject, OnInit, signal } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { DynamicForm } from "../../../../shared/components/forms/dynamic-form/dynamic-form";
import { StaffFormConfig } from "./staff-create.config";
import { StaffFacade } from "../../services/staff.facade";
import { Loading } from "../../../../shared/directives/loading/loading";
import { formatTime, parseTime } from "../../../../core/utils/time.util";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { StaffAdaptModel } from "../../models/staff-adapt.model";
@Component({
    selector: "app-staff-create",
    imports: [DynamicForm, Loading],
    templateUrl: "./staff-create.html",
    styleUrl: "./staff-create.scss",
})
export class StaffCreate {

    private readonly _dialogRef = inject(DynamicDialogRef);
    private readonly _dialogConfig = inject(DynamicDialogConfig);
    private readonly _staffFacade = inject(StaffFacade);

    staffFormConfig = StaffFormConfig;
    staffForm!: FormGroup;
    isLoading = signal(false);
    isEditMode = signal(false);
    staffId = signal<string | null>(null);




    onFormReady(form: FormGroup) {
        this.staffForm = form;

        if (this._dialogConfig.data) {
            this.isEditMode.set(true);
            const data = this._dialogConfig.data as StaffAdaptModel;
            this.staffId.set(data._id);

            const [startStr, endStr] = data.timing ? data.timing.split(' to ') : [null, null];

            this.staffForm.patchValue({
                fullname: data.staffProfile?.fullname,
                position: data.staffProfile?.position,
                email: data.email,
                phoneNumber: data.phoneNumber,
                salary: data.salary,
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
                startShiftTiming: parseTime(startStr),
                endShiftTiming: parseTime(endStr),
                address: data.address,
                image: data.staffProfile?.image
            });
        }
    }

    onSubmit() {
        if (this.staffForm?.valid) {
            const formValue = { ...this.staffForm.value };

            // Format dateOfBirth
            if (formValue.dateOfBirth instanceof Date) {
                formValue.dateOfBirth = formValue.dateOfBirth.toISOString();
            }



            // Format timings
            if (formValue.startShiftTiming) {
                formValue.startShiftTiming = formatTime(formValue.startShiftTiming);
            }
            if (formValue.endShiftTiming) {
                formValue.endShiftTiming = formatTime(formValue.endShiftTiming);
            }


            // Extract image before sending to API (File objects can't be JSON-serialized)
            const imageFile: File | null = formValue.image;
            delete formValue.image;

            const submitObservable = this._staffFacade.saveStaff(
                this.isEditMode() ? this.staffId() : null,
                formValue,
                imageFile
            );

            this.isLoading.set(true);
            submitObservable.subscribe({
                next: () => {
                    this.isLoading.set(false);
                    this._dialogRef.close();
                },
                error: () => {
                    this.isLoading.set(false);
                }
            });
        } else {
            this.staffForm?.markAllAsTouched();
        }
    }

    onCancel() {
        this._dialogRef.close();
    }
}
