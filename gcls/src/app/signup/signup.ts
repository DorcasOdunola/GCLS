import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../service/auth-service';

function phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
  const value = String(control.value ?? '');
  if (!value) {
    return null;
  }

  if (!/^\+?(?:[0-9\s.-]|\([0-9\s.-]*[0-9][0-9\s.-]*\))+$/.test(value)) {
    return { phoneFormat: true };
  }

  const digitCount = value.replace(/\D/g, '').length;
  return digitCount >= 7 && digitCount <= 15 ? null : { phoneLength: true };
}

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  readonly signupForm;

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
  ) {
    this.signupForm = this.fb.nonNullable.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, phoneNumberValidator]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  hidePassword = true;
  isSubmitting = false;
  submitMessage = '';

  submit(): void {
    this.submitMessage = '';

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const registrationData = this.signupForm.getRawValue();
    this.authService.signup(registrationData).subscribe({
      next: (response) => {
        console.log('Signup response:', response);
        this.submitMessage = 'Registration successful! You can now log in.';
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Signup error:', error);
        if (error.status === 409 && error.error?.message) {
          this.submitMessage = `Registration failed: ${error.error.message}`;
        } else {
          this.submitMessage = 'An error occurred during registration. Please try again.';
        }
        this.isSubmitting = false;
      },
    });
  }
}
