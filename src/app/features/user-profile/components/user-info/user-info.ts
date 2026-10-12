import { Component, signal, inject, OnInit, DestroyRef, computed } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
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
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { MessageService } from "primeng/api";

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
    private readonly _messageService = inject(MessageService);
    private readonly _translate = inject(TranslateService);

    /** Current user data structure */
    readonly user = signal<User | null>(null);

    /** Loading state for initial profile retrieval */
    readonly loading = signal<boolean>(true);

    /** Saving state for profile form submission */
    readonly saving = signal<boolean>(false);

    /** Uploading state for profile avatar image */
    readonly uploading = signal<boolean>(false);

    /** Profile image URL */
    readonly imageUrl = signal<string>("");

    /** User initials computed for elegant placeholder avatar */
    readonly initials = computed(() => {
        const u = this.user();
        if (!u) return "U";
        const first = (u.firstName || "").trim().charAt(0);
        const last = (u.lastName || "").trim().charAt(0);
        return (first + last).toUpperCase() || "U";
    });

    /** Main profile configuration form */
    readonly profileForm: FormGroup = this._fb.group(
        {
            firstName: ["", [Validators.required, Validators.minLength(2)]],
            lastName: ["", [Validators.required]],
            email: ["", [Validators.required, Validators.email]],
            address: ["", []],
            newPassword: ["", [Validators.minLength(8), passwordValidator()]],
            confirmPassword: ["", []],
        },
        { validators: this.passwordMatchValidator }
    );

    /** Validation configurations */
    readonly firstNameConfig = {
        controlName: "firstName",
        errorMessages: {
            required: "AUTH.VALIDATION.FIRST_NAME_REQUIRED",
            minlength: "AUTH.VALIDATION.FIRST_NAME_MIN_LENGTH",
        },
    };

    readonly lastNameConfig = {
        controlName: "lastName",
        errorMessages: {
            required: "AUTH.VALIDATION.LAST_NAME_REQUIRED",
        },
    };

    readonly emailConfig = {
        controlName: "email",
        errorMessages: {
            required: "AUTH.VALIDATION.EMAIL_REQUIRED",
            email: "AUTH.VALIDATION.EMAIL_INVALID",
        },
    };

    readonly passwordConfig = {
        controlName: "newPassword",
        errorMessages: {
            minlength: "AUTH.VALIDATION.PASSWORD_MIN_LENGTH",
            passwordStrength: "AUTH.VALIDATION.PASSWORD_STRENGTH",
        },
    };

    readonly confirmPasswordConfig = {
        controlName: "confirmPassword",
        errorMessages: {
            passwordMismatch: "USER_PROFILE.PASSWORD_MISMATCH",
        },
    };

    ngOnInit(): void {
        this.getProfile();
    }

    /**
     * Cross-field validator ensuring newPassword and confirmPassword match
     */
    private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const newPassword = control.get("newPassword")?.value;
        const confirmPassword = control.get("confirmPassword")?.value;

        if (newPassword && confirmPassword && newPassword !== confirmPassword) {
            control.get("confirmPassword")?.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        }
        if (!newPassword || newPassword === confirmPassword) {
            const currentErrors = control.get("confirmPassword")?.errors;
            if (currentErrors?.["passwordMismatch"]) {
                delete currentErrors["passwordMismatch"];
                control.get("confirmPassword")?.setErrors(Object.keys(currentErrors).length ? currentErrors : null);
            }
        }
        return null;
    }

    /**
     * Resolves the profile image URL prioritizing Cloudinary / backend URL, then generating custom UI avatar
     */
    resolveAvatarUrl(user: User | null): string {
        if (!user) return "";
        const pic: any = user.profilePicture;
        if (typeof pic === "string" && pic.trim()) {
            return pic.trim();
        }
        if (typeof pic === "object" && pic?.secure_url) {
            return pic.secure_url;
        }
        const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=fac1d9&color=111111&bold=true&size=240`;
    }

    /**
     * Fallback if image fails to load
     */
    onImageError(): void {
        const u = this.user();
        const name = u ? `${u.firstName || ""} ${u.lastName || ""}`.trim() : "User";
        this.imageUrl.set(
            `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=fac1d9&color=111111&bold=true&size=240`
        );
    }

    /**
     * Fetches fresh server-side user data to populate the profile form
     */
    getProfile(): void {
        this.loading.set(true);

        // Instant population from cached session if available
        const cached = this._authService.currentUser();
        if (cached) {
            this.applyUserData(cached);
        }

        this._userProfileService
            .getProfile()
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: (res) => {
                    if (res?.data) {
                        this.applyUserData(res.data);
                        this._authService.currentUser.set(res.data);
                    }
                    this.loading.set(false);
                },
                error: () => {
                    this.loading.set(false);
                },
            });
    }

    /**
     * Synchronizes user object and form values
     */
    private applyUserData(user: User): void {
        this.user.set(user);
        this.profileForm.patchValue({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            address: user.address || "",
            newPassword: "",
            confirmPassword: "",
        });
        this.profileForm.markAsPristine();
        this.imageUrl.set(this.resolveAvatarUrl(user));
    }

    /**
     * Handles file selection for updating the user's profile picture
     */
    async onFileSelected(event: Event): Promise<void> {
        const { files } = await this._uploadFileService.onFileSelected(event, {
            allowedTypes: ["image/jpeg", "image/png", "image/webp"],
            maxFiles: 1,
            maxSizeMB: 2,
        });

        if (files.length > 0) {
            const userId = this.user()?._id;
            if (!userId) return;

            this.uploading.set(true);
            this._userProfileService
                .uploadProfileImage(userId, files[0])
                .pipe(takeUntilDestroyed(this._destroyRef))
                .subscribe({
                    next: (res) => {
                        this.uploading.set(false);
                        const updatedUser = res?.data || this.user();
                        if (updatedUser) {
                            this.applyUserData(updatedUser);
                            this._authService.currentUser.set(updatedUser);
                        }
                        this._messageService.add({
                            severity: "success",
                            summary: this._translate.instant("USER_PROFILE.SUCCESS_TITLE"),
                            detail: this._translate.instant("USER_PROFILE.SUCCESS_PHOTO"),
                        });
                    },
                    error: (err) => {
                        this.uploading.set(false);
                        console.error("Error uploading image", err);
                        this._messageService.add({
                            severity: "error",
                            summary: "Upload Error",
                            detail: "Failed to upload image. Please try again.",
                        });
                    },
                });
        }
    }

    /**
     * Submits the updated profile settings
     */
    onSubmit(): void {
        if (this.profileForm.invalid) {
            this.profileForm.markAllAsTouched();
            return;
        }

        const userId = this.user()?._id;
        if (!userId) return;

        this.saving.set(true);
        const formValue = this.profileForm.value;

        const profileData: Partial<User> = {
            firstName: formValue.firstName?.trim(),
            lastName: formValue.lastName?.trim(),
            address: formValue.address?.trim() || "",
        };

        this._userProfileService
            .updateProfile(userId, profileData)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: (res) => {
                    const updatedUser = res?.data;

                    // If a new password was provided, update credentials
                    if (formValue.newPassword?.trim()) {
                        this._userProfileService
                            .updatePassword(userId, formValue.newPassword.trim())
                            .pipe(takeUntilDestroyed(this._destroyRef))
                            .subscribe({
                                next: () => {
                                    this.onSaveSuccess(updatedUser);
                                },
                                error: (err) => {
                                    this.saving.set(false);
                                    console.error("Password update error", err);
                                    this._messageService.add({
                                        severity: "warn",
                                        summary: "Partial Update",
                                        detail: "Profile info updated, but password change failed.",
                                    });
                                },
                            });
                    } else {
                        this.onSaveSuccess(updatedUser);
                    }
                },
                error: (err) => {
                    this.saving.set(false);
                    console.error("Error updating profile", err);
                    this._messageService.add({
                        severity: "error",
                        summary: "Update Failed",
                        detail: "Could not update profile. Please try again.",
                    });
                },
            });
    }

    private onSaveSuccess(updatedUser?: User): void {
        this.saving.set(false);
        this.profileForm.patchValue({
            newPassword: "",
            confirmPassword: "",
        });
        this.profileForm.markAsPristine();

        if (updatedUser) {
            this.applyUserData(updatedUser);
            this._authService.currentUser.set(updatedUser);
        } else {
            this.getProfile();
        }

        this._messageService.add({
            severity: "success",
            summary: this._translate.instant("USER_PROFILE.SUCCESS_TITLE"),
            detail: this._translate.instant("USER_PROFILE.SUCCESS_UPDATE"),
        });
    }

    /**
     * Resets the form back to current user data
     */
    discardChanges(): void {
        if (this.user()) {
            this.applyUserData(this.user()!);
            this.profileForm.markAsPristine();
            this.profileForm.markAsUntouched();
        }
    }
}
