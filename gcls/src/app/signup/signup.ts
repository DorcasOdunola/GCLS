import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth-service';

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
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
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
    this.authService.signup(registrationData).subscribe(
      (response) => {
        console.log('Signup response:', response);
        this.submitMessage = 'Registration successful! You can now log in.';
        this.isSubmitting = false;
      },
      (error) => {
        console.error('Signup error:', error);
        this.submitMessage = 'An error occurred during registration. Please try again.';
        this.isSubmitting = false;
      },
    );

    // The registration API is not available yet. Keep the payload ready for integration.
    console.info('Signup payload ready for API integration:', registrationData);
    this.submitMessage = 'Your account details are ready to be submitted.';
    this.isSubmitting = false;
  }
}
