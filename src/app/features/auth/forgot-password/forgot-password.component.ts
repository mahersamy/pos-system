import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.forgotPasswordForm = this.fb.group({
      username: ['', [Validators.required]], // Image labels it "Username" but text says "username or email"
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.forgotPasswordForm.valid) {
      console.log('Forgot Password form value:', this.forgotPasswordForm.value);
      // Implement forgot password logic here
    }
  }
}
