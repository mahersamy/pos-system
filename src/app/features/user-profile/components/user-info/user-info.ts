import {Component, signal, inject, OnInit, DestroyRef} from "@angular/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import {CommonModule} from "@angular/common";
import {SkeletonModule} from "primeng/skeleton";
import {FieldValidation} from "../../../../shared/components/forms/field-validation/field-validation";
import {UploadFileService} from "../../../../core/services/file-upload/upload-file";
import {UserProfileService} from "../../services/user-profile/user-profile";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {User} from "../../../../core/models/user.model";
import {passwordValidator} from "../../../../shared/validators/password.validator";

@Component({
    selector: "app-user-info",
    imports: [
        ReactiveFormsModule,
        InputTextModule,
        PasswordModule,
        CommonModule,
        SkeletonModule,
        FieldValidation,
    ],
    templateUrl: "./user-info.html",
    styleUrl: "./user-info.scss",
})
export class UserInfo implements OnInit {
    private readonly _fb = inject(FormBuilder);
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
        firstName: ["John Doe", [Validators.required]],
        email: ["johndoe123@gmail.com", [Validators.required, Validators.email]],
        address: ["123 Street USA, Chicago", [Validators.required]],
        newPassword: ["", [Validators.minLength(8), passwordValidator()]],
        confirmPassword: ["", []],
    });

    /** Error handling configuration for the First Name input */
    firstNameConfig = {
        controlName: "firstName",
        errorMessages: {
            required: "First name is required",
        },
    };

    /** Error handling configuration for the Email input */
    emailConfig = {
        controlName: "email",
        errorMessages: {
            required: "Email is required",
            email: "Invalid email format",
        },
    };

    /** Error handling configuration for the Address input */
    addressConfig = {
        controlName: "address",
        errorMessages: {
            required: "Address is required",
        },
    };

    /** Error handling configuration for the Password input */
    passwordConfig = {
        controlName: "newPassword",
        errorMessages: {
            minlength: "Password must be at least 8 characters",
            passwordStrength: "Password must include uppercase, lowercase, number and special character",
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
        this._userProfileService
            .getProfile()
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: (res) => {
                    this.user.set(res.data);
                    this.profileForm.patchValue(res.data);
                    if (res.data.profilePicture) {
                        this.imageUrl.set(res.data.profilePicture);
                    }
                    this.loading.set(false);
                },
                error: (err) => {
                    console.error("Error loading profile", err);
                    this.loading.set(false);
                },
            });
    }

    /**
     * Handles file selection for updating the user's profile picture
     * @param {Event} event - The HTML file input change event
     */
    async onFileSelected(event: Event) {
        const {files} = await this._uploadFileService.onFileSelected(event, {
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
}
