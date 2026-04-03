import {Component, signal, inject} from "@angular/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import {NgOptimizedImage} from "@angular/common";
import {FieldValidation} from "../../../../shared/components/forms/field-validation/field-validation";

@Component({
    selector: "app-user-info",
    imports: [
        ReactiveFormsModule,
        InputTextModule,
        PasswordModule,
        NgOptimizedImage,
        FieldValidation,
    ],
    templateUrl: "./user-info.html",
    styleUrl: "./user-info.scss",
})
export class UserInfo {
    private fb = inject(FormBuilder);

    profileForm: FormGroup = this.fb.group({
        firstName: ["John Doe", [Validators.required]],
        email: ["johndoe123@gmail.com", [Validators.required, Validators.email]],
        address: ["123 Street USA, Chicago", [Validators.required]],
        newPassword: ["", [Validators.minLength(8)]],
        confirmPassword: ["", []],
    });

    firstNameConfig = {
        controlName: "firstName",
        errorMessages: {
            required: "First name is required",
        },
    };

    emailConfig = {
        controlName: "email",
        errorMessages: {
            required: "Email is required",
            email: "Invalid email format",
        },
    };

    addressConfig = {
        controlName: "address",
        errorMessages: {
            required: "Address is required",
        },
    };

    passwordConfig = {
        controlName: "newPassword",
        errorMessages: {
            minlength: "Password must be at least 8 characters",
        },
    };

    imageUrl = signal<string>(
        "https://ui-avatars.com/api/?name=John+Doe&background=fac1d9&color=111"
    );

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            const fileSize = file.size / 1024 / 1024; // MB

            if (!file.type.startsWith("image/")) {
                alert("Please select an image file.");
                return;
            }

            if (fileSize > 5) {
                alert("File size must be less than 5MB.");
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                this.imageUrl.set(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    onSubmit() {
        if (this.profileForm.valid) {
            console.log("Form Submitted", this.profileForm.value);
        }
    }
}
