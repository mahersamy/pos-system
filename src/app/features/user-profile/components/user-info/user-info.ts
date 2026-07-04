import { Component, signal, inject, OnInit, DestroyRef } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { CommonModule } from "@angular/common";
import { FieldValidation } from "../../../../shared/components/forms/field-validation/field-validation";
import { UploadFileService } from "../../../../core/services/file-upload/upload-file";
import { UserProfileService } from "../../services/user-profile/user-profile";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { User } from "../../../users/model/user.model";
import { passwordValidator } from "../../../../shared/validators/password.validator";
import { ProfileSkeleton } from "../profile-skeleton/profile-skeleton";
import { AuthService } from "../../../../core/services/auth/auth";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: "app-user-info",
    imports: [
        ReactiveFormsModule,
        InputTextModule,
        PasswordModule,
        CommonModule,
        FieldValidation,
        ProfileSkeleton,
        TranslateModule,
    ],
    templateUrl: "./user-info.html",
    styleUrl: "./user-info.scss",
})
export class UserInfo implements OnInit {
    private readonly _fb = inject(FormBuilder);
    private readonly _authService = inject(AuthService);
    private readonly _uploadFileService = inject(UploadFileService);
    private readonly _userProfileService = inject(UserProfileService);
    private readonly _destroyRef = inject(DestroyRef);

    /** Current user data structure */
    user = signal<User | null>(null);

    /** Loading state for the component */
    loading = signal<boolean>(true);

    /** User profile image signal, preloaded with a fallback avatar */
    imageUrl = signal<string>("https://ui-avatars.com/api/?name=User&background=fac1d9&color=111");

    /** Main profile configuration form */
    profileForm: FormGroup = this._fb.group({
        firstName: ["", [Validators.required]],
        lastName: ["", [Validators.required]],
        email: ["", [Validators.required, Validators.email]],
        address: ["", [Validators.required]],
        newPassword: ["", [Validators.minLength(8), passwordValidator()]],
        confirmPassword: ["", []],
    });

    /** Error handling configuration for the First Name input */
    firstNameConfig = {
        controlName: "firstName",
        errorMessages: {
            required: "AUTH.VALIDATION.FIRST_NAME_REQUIRED",
        },
    };

    /** Error handling configuration for the Last Name input */
    lastNameConfig = {
        controlName: "lastName",
        errorMessages: {
            required: "AUTH.VALIDATION.LAST_NAME_REQUIRED",
        },
    };

    /** Error handling configuration for the Email input */
    emailConfig = {
        controlName: "email",
        errorMessages: {
            required: "AUTH.VALIDATION.EMAIL_REQUIRED",
            email: "AUTH.VALIDATION.EMAIL_INVALID",
        },
    };

    /** Error handling configuration for the Address input */
    addressConfig = {
        controlName: "address",
        errorMessages: {
            required: "AUTH.VALIDATION.ADDRESS_REQUIRED",
        },
    };

    /** Error handling configuration for the Password input */
    passwordConfig = {
        controlName: "newPassword",
        errorMessages: {
            minlength: "AUTH.VALIDATION.PASSWORD_MIN_LENGTH",
            passwordStrength: "AUTH.VALIDATION.PASSWORD_STRENGTH",
        },
    };

    ngOnInit(): void {
        this.getProfile();
    }

    /**
     * Fetches current server-side user settings to populate the form
     */
    getProfile() {
        this.loading.set(true);
        const currentUser = this._authService.currentUser();
        if (currentUser) {
            this.user.set(currentUser);
            this.profileForm.patchValue(currentUser);

            // Set the profile image URL prioritize the actual picture, then customized avatar
            if (currentUser.profilePicture) {
                this.imageUrl.set(currentUser.profilePicture);
            } else {
                this.imageUrl.set(
                    `https://ui-avatars.com/api/?name=${currentUser.firstName}+${currentUser.lastName}&background=fac1d9&color=111`
                );
            }
            this.loading.set(false);
        }
    }

    /**
     * Handles file selection for updating the user's profile picture
     * @param {Event} event - The HTML file input change event
     */
    async onFileSelected(event: Event) {
        const { files } = await this._uploadFileService.onFileSelected(event, {
            allowedTypes: ["image/jpeg", "image/png", "image/webp"],
            maxFiles: 1,
            maxSizeMB: 2,
        });

        if (files.length > 0) {
            const userId = this.user()?._id;
            if (!userId) return;

            this._userProfileService
                .uploadProfileImage(userId, files[0])
                .pipe(takeUntilDestroyed(this._destroyRef))
                .subscribe({
                    next: (res) => {
                        this.getProfile(); // Reload to get updated image
                    },
                    error: (err) => console.error("Error uploading image", err),
                });
        }
    }

    /**
     * Submits the updated profile settings if the form strictly validates successfully
     */
    onSubmit() {
        if (this.profileForm.valid) {
            console.log("Form Submitted", this.profileForm.value);
        } else {
            this.profileForm.markAllAsTouched();
        }
    }

    /**
     * Updates the user's profile information by sending the form data to the backend.
     */
    changeProfileInfo() {
        this.loading.set(true);
        this._userProfileService
            .updateProfile(this.user()?._id!, this.profileForm.value)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: (res) => {
                    this.getProfile(); // Reload to get updated image
                    this.loading.set(false);
                },
                error: (err) => console.error("Error uploading image", err),
            });
    }
}
