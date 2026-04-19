import {Component, inject} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";

@Component({
    selector: "app-forgot-password",
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: "./forgot-password.html",
    styleUrl: "./forgot-password.scss",
})
export class ForgotPassword {
    private readonly _fb = inject(FormBuilder);

    /** Main form group tracking the user's forgot-password inputs */
    forgotPasswordForm: FormGroup = this._fb.group({
        username: ["", [Validators.required]],
    });

    /** Tracks whether the user has attempted to submit the form */
    submitted = false;

    /**
     * Submits the forgot password request. Validates the username input
     * before routing the logic.
     */
    onSubmit(): void {
        this.submitted = true;
        if (this.forgotPasswordForm.valid) {
            console.log("Forgot Password form value:", this.forgotPasswordForm.value);
            // Implement forgot password logic here
        }
    }
}
