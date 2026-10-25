import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthFacade } from "../../../core/services/auth/auth.facade";
import { TranslateModule } from "@ngx-translate/core";

import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { FieldValidation } from "../../../shared/components/forms/field-validation/field-validation";
import { passwordValidator } from "../../../shared/validators/password.validator";
import { Loading } from "../../../shared/directives/loading/loading";

@Component({
    selector: "app-login",
    imports: [
        ReactiveFormsModule,
        CommonModule,
        RouterLink,
        InputTextModule,
        PasswordModule,
        FieldValidation,
        TranslateModule,
        Loading,
    ],
    templateUrl: "./login.html",
    styleUrl: "./login.scss",
})
export class Login {
    private readonly _authFacade = inject(AuthFacade);
    private readonly _formBuilder = inject(FormBuilder);

    /** Loading signal delegated directly from AuthFacade */
    readonly isLoading = this._authFacade.loading;

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
     * Submits the login form.
     * AuthFacade manages state (loading, error), subscriptions via DestroyRef, and post-login routing.
     */
    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        const { email, password } = this.loginForm.value;
        this._authFacade.login(email, password);
    }
}
