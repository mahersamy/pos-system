import {Component, inject, signal, DestroyRef} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from "@angular/forms";
import {RouterModule, Router} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MessageService} from "primeng/api";

import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import {FieldValidation} from "../../../shared/components/forms/field-validation/field-validation";
import {Loading} from "../../../shared/directives/loading/loading";
import {passwordValidator} from "../../../shared/validators/password.validator";
import {AuthService} from "../../../core/services/auth/auth";

/** Represents the three steps of the forgot-password flow */
type ForgotPasswordStep = "email" | "otp" | "reset";

@Component({
    selector: "app-forgot-password",
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        TranslateModule,
        InputTextModule,
        PasswordModule,
        FieldValidation,
        Loading,
    ],
    templateUrl: "./forgot-password.html",
    styleUrl: "./forgot-password.scss",
})
export class ForgotPassword {
    private readonly _fb = inject(FormBuilder);
    private readonly _authService = inject(AuthService);
    private readonly _router = inject(Router);
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _messageService = inject(MessageService);

    /** Tracks the current step of the multi-step flow */
    currentStep = signal<ForgotPasswordStep>("email");

    /** Whether an API call is currently in progress */
    isLoading = signal(false);

    /** The email captured from step 1, passed through to subsequent steps */
    private _capturedEmail = "";

    /** The OTP captured from step 2, passed through to the reset step */
    private _capturedOtp = "";

    // ── Step 1: Email Form ─────────────────────────────────────────────────

    emailForm: FormGroup = this._fb.group({
        email: ["", [Validators.required, Validators.email]],
    });

    emailFieldConfig = {
        controlName: "email",
        errorMessages: {
            required: "AUTH.VALIDATION.EMAIL_REQUIRED",
            email: "AUTH.VALIDATION.EMAIL_INVALID",
        },
    };

    // ── Step 2: OTP Verification Form ──────────────────────────────────────

    otpForm: FormGroup = this._fb.group({
        otp: [
            "",
            [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(6),
                Validators.pattern(/^\d{6}$/),
            ],
        ],
    });

    otpFieldConfig = {
        controlName: "otp",
        errorMessages: {
            required: "AUTH.FORGOT_PASS.OTP_REQUIRED",
            minlength: "AUTH.FORGOT_PASS.OTP_LENGTH",
            maxlength: "AUTH.FORGOT_PASS.OTP_LENGTH",
            pattern: "AUTH.FORGOT_PASS.OTP_NUMERIC",
        },
    };

    // ── Step 3: Reset Password Form ────────────────────────────────────────

    resetForm: FormGroup = this._fb.group(
        {
            password: ["", [Validators.required, Validators.minLength(8), passwordValidator()]],
            confirmPassword: ["", [Validators.required]],
        },
        { validators: this._passwordMatchValidator }
    );

    passwordFieldConfig = {
        controlName: "password",
        errorMessages: {
            required: "AUTH.VALIDATION.PASSWORD_REQUIRED",
            minlength: "AUTH.VALIDATION.PASSWORD_MIN_LENGTH",
            passwordStrength: "AUTH.VALIDATION.PASSWORD_STRENGTH",
        },
    };

    confirmPasswordFieldConfig = {
        controlName: "confirmPassword",
        errorMessages: {
            required: "AUTH.FORGOT_PASS.CONFIRM_PASSWORD_REQUIRED",
            passwordMismatch: "AUTH.FORGOT_PASS.PASSWORD_MISMATCH",
        },
    };

    // ── Actions ────────────────────────────────────────────────────────────

    /**
     * Step 1: Submits the email to receive a password-reset OTP
     */
    onSubmitEmail(): void {
        if (this.emailForm.invalid) {
            this.emailForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);
        this._capturedEmail = this.emailForm.value.email;

        this._authService
            .forgotPassword(this._capturedEmail)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: () => {
                    this.isLoading.set(false);
                    this.currentStep.set("otp");
                    this._messageService.add({
                        severity: "success",
                        summary: "OTP Sent",
                        detail: "A verification code has been sent to your email",
                        life: 5000,
                    });
                },
                error: () => {
                    this.isLoading.set(false);
                },
            });
    }

    /**
     * Step 2: Verifies the 6-digit OTP code
     */
    onSubmitOtp(): void {
        if (this.otpForm.invalid) {
            this.otpForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);
        this._capturedOtp = this.otpForm.value.otp;

        this._authService
            .verifyOtp(this._capturedEmail, this._capturedOtp)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: () => {
                    this.isLoading.set(false);
                    this.currentStep.set("reset");
                    this._messageService.add({
                        severity: "success",
                        summary: "OTP Verified",
                        detail: "OTP has been verified successfully",
                        life: 5000,
                    });
                },
                error: () => {
                    this.isLoading.set(false);
                },
            });
    }

    /**
     * Step 3: Resets the password with the verified OTP
     */
    onSubmitReset(): void {
        if (this.resetForm.invalid) {
            this.resetForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);
        const { password, confirmPassword } = this.resetForm.value;

        this._authService
            .resetPassword(this._capturedEmail, this._capturedOtp, password, confirmPassword)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: () => {
                    this.isLoading.set(false);
                    this._messageService.add({
                        severity: "success",
                        summary: "Password Reset",
                        detail: "Your password has been reset successfully. Please log in.",
                        life: 5000,
                    });
                    this._router.navigate(["/login"]);
                },
                error: () => {
                    this.isLoading.set(false);
                },
            });
    }

    /**
     * Re-sends the OTP to the captured email (for step 2)
     */
    resendOtp(): void {
        this.isLoading.set(true);
        this._authService
            .forgotPassword(this._capturedEmail)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: () => {
                    this.isLoading.set(false);
                    this._messageService.add({
                        severity: "success",
                        summary: "OTP Resent",
                        detail: "A new verification code has been sent to your email",
                        life: 5000,
                    });
                },
                error: () => {
                    this.isLoading.set(false);
                },
            });
    }

    /**
     * Navigates back to the previous step in the flow
     */
    goBack(): void {
        const step = this.currentStep();
        if (step === "otp") {
            this.currentStep.set("email");
        } else if (step === "reset") {
            this.currentStep.set("otp");
        }
    }

    // ── Private Validators ─────────────────────────────────────────────────

    /**
     * Cross-field validator ensuring password and confirmPassword match
     */
    private _passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
        const password = group.get("password")?.value;
        const confirm = group.get("confirmPassword")?.value;

        if (password && confirm && password !== confirm) {
            group.get("confirmPassword")?.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        }
        return null;
    }
}
