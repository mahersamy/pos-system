import { Validators } from "@angular/forms";
import { FormInputType } from "../../../../shared/components/forms/dynamic-form/enum/form.enum";
import { FormFieldConfig } from "../../../../shared/components/forms/dynamic-form/interfaces/form-config.type";
import { minAgeValidator } from "../../../../shared/components/forms/dynamic-form/validators/min-age.validator";

export const StaffFormConfig: FormFieldConfig[] = [
    {
        type: FormInputType.file,
        controlName: "image",
        label: "Image",
        placeholder: "Upload staff image",
        validators: []
    },
    {
        type: FormInputType.text,
        controlName: "fullname",
        label: "Full Name",
        placeholder: "Enter staff full name",
        validators: [Validators.required],
        errorMessages: { required: "Full Name is required" }
    },
    {
        type: FormInputType.email,
        controlName: "email",
        label: "Email",
        placeholder: "Enter email",
        validators: [Validators.required, Validators.email],
        errorMessages: { required: "Email is required", email: "Invalid email format" }
    },
    {
        type: FormInputType.text,
        controlName: "position",
        label: "Position",
        placeholder: "Enter position",
        validators: [Validators.required],
        errorMessages: { required: "Position is required" }
    },
    {
        type: FormInputType.phone,
        controlName: "phoneNumber",
        label: "Phone Number",
        placeholder: "Enter phone number",
        validators: [Validators.required, Validators.minLength(11), Validators.maxLength(11)],
        errorMessages: { required: "Phone number is required", minlength: "Phone number must be exactly 11 characters", maxlength: "Phone number must be exactly 11 characters" }
    },
    {
        type: FormInputType.textarea,
        controlName: "address",
        label: "Address",
        placeholder: "Enter address",
        validators: []
    },
    {
        type: FormInputType.number,
        controlName: "salary",
        label: "Salary",
        placeholder: "Enter salary",
        validators: [Validators.required],
        errorMessages: { required: "Salary is required" }
    },
    {
        type: FormInputType.date,
        controlName: "dateOfBirth",
        label: "Date of Birth",
        placeholder: "Select date of birth",
        validators: [Validators.required, minAgeValidator(18)],
        errorMessages: { required: "Date of birth is required", minAge: "Staff must be at least 18 years old" }
    },
    {
        type: FormInputType.time,
        controlName: "startShiftTiming",
        label: "Start Shift Timing",
        placeholder: "Select start shift time",
        validators: [Validators.required],
        errorMessages: { required: "Start shift timing is required" }
    },
    {
        type: FormInputType.time,
        controlName: "endShiftTiming",
        label: "End Shift Timing",
        placeholder: "Select end shift time",
        validators: [Validators.required],
        errorMessages: { required: "End shift timing is required" }
    },
    {
        type: FormInputType.textarea,
        controlName: "details",
        label: "Details",
        placeholder: "Enter additional details",
        validators: []
    }
];