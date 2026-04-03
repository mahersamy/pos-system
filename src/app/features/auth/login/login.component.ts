import {Component, inject, signal} from "@angular/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {AuthService} from "../../../core/services/auth/auth";

@Component({
    selector: "app-login",
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
    private readonly _authService = inject(AuthService);
    private readonly fb = inject(FormBuilder);
    private readonly _router = inject(Router);

    ngOnInit(): void {
        this._authService.getLoggedUserProfile().subscribe({
            next: (response) => {
                this._router.navigate(["/main"]);
            },
        });
    }

    showPassword = signal(false);
    isLoading = signal(false);

    loginForm: FormGroup = this.fb.group({
        email: ["admin@live.com", [Validators.required, Validators.email]],
        password: ["Pass@123", [Validators.required, Validators.minLength(6)]],
    });

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);
        const {email, password} = this.loginForm.value;

        this._authService.login(email, password).subscribe({
            next: (loginData) => {
                this.isLoading.set(false);
                this._router.navigate(["main"]);
            },
            error: (err) => {
                console.error("Login error:", err);
                this.isLoading.set(false);
            },
        });
    }
}
