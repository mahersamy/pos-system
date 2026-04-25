import {Component, inject, signal, DestroyRef, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {AuthService} from "../../../core/services/auth/auth";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {TranslateModule} from "@ngx-translate/core";

import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import {FieldValidation} from "../../../shared/components/forms/field-validation/field-validation";
import {passwordValidator} from "../../../shared/validators/password.validator";

@Component({
    selector: "app-login",
    imports: [ReactiveFormsModule, CommonModule, InputTextModule, PasswordModule, FieldValidation, TranslateModule],
    templateUrl: "./login.html",
    styleUrl: "./login.scss",
})
export class Login {
    private readonly _authService = inject(AuthService);
    private readonly _formBuilder = inject(FormBuilder);
    private readonly _router = inject(Router);
    private readonly _destroyRef = inject(DestroyRef);

    isLoading = signal(false);

    /** Login form configuration with basic validations */
    loginForm: FormGroup = this._formBuilder.group({
        email: ["admin@live.com", [Validators.required, Validators.email]],
        password: ["Pass@123", [Validators.required, Validators.minLength(8), passwordValidator()]],
    });

    /** Error handling configuration for the Email input */
    emailConfig = {
        controlName: "email",
        errorMessages: {
            required: "AUTH.VALIDATION.EMAIL_REQUIRED",
            email: "AUTH.VALIDATION.EMAIL_INVALID",
        },
    };

    /** Error handling configuration for the Password input */
    passwordConfig = {
        controlName: "password",
        errorMessages: {
            required: "AUTH.VALIDATION.PASSWORD_REQUIRED",
            minlength: "AUTH.VALIDATION.PASSWORD_MIN_LENGTH",
            passwordStrength: "AUTH.VALIDATION.PASSWORD_STRENGTH",
        },
    };

    
    /**
     * Submits the login form logic. If invalid, touches all fields to show errors.
     * Starts loaders and authenticates the user otherwise.
     */
    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);
        const {email, password} = this.loginForm.value;

        this._authService
            .login(email, password)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: (user) => {
                    this._router.navigate(["main"]);
                },
                error: (error) => {
                    console.error("Login processing error:", error);
                    this.isLoading.set(false);
                },
            });
    }
}
