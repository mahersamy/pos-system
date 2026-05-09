import { FormInputType } from "../../../../shared/components/forms/dynamic-form/enum/form.enum";
import { FormFieldConfig } from "../../../../shared/components/forms/dynamic-form/interfaces/form-config.type";

export const StaffFormConfig: FormFieldConfig[] = [
    {
        type: FormInputType.text,
        controlName: "fullName",
        label: "Full Name",
        placeholder: "Enter staff full name",
        validators: [],
        errorMessages: { required: "Full Name is required" }
    },
    {
        type: FormInputType.text,
        controlName: "fullName",
        label: "Full Name",
        placeholder: "Enter staff full name",
        validators: [],
        errorMessages: { required: "Full Name is required" }
    },
    {
        type: FormInputType.text,
        controlName: "fullName",
        label: "Full Name",
        placeholder: "Enter staff full name",
        validators: [],
        errorMessages: { required: "Full Name is required" }
    },
    {
        type: FormInputType.text,
        controlName: "fullName",
        label: "Full Name",
        placeholder: "Enter staff full name",
        validators: [],
        errorMessages: { required: "Full Name is required" }
    },
    {
        type: FormInputType.file,
        controlName: "imageUrl",
        label: "Image",
        placeholder: "Select image",
        validators: [],
        acceptedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
        maxFileSize: 2097152,
        errorMessages: { required: "Image is required" }

    },
    {
        type: FormInputType.select,
        controlName: "role",
        label: "Staff Role",
        selectOptions: [
            { label: "Manager", value: "MANAGER" },
            { label: "Cashier", value: "CASHIER" },
            { label: "Inventory Staff", value: "INVENTORY" }
        ],
        placeholder: "Select a role"
    },
    {
        type: FormInputType.date,
        controlName: "joinDate",
        label: "Join Date",
        placeholder: "Select join date"
    }
];