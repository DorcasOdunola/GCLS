import { Component } from '@angular/core';
import { AuthService } from '../service/auth-service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(
    public authService: AuthService,
    public router: Router,
  ) {}

  public email: string = '';
  public password: string = '';
  public incorrect: string = '';
  public loading: boolean = false;
  public hidePassword: boolean = true;

  login(form?: NgForm) {
    // if (form?.invalid) {
    //   form.control.markAllAsTouched();
    //   return;
    // }

    this.incorrect = '';
    this.loading = true;
    const obj = {
      email: this.email,
      password: this.password,
    };

    this.authService.login(obj).subscribe(
      (response) => {
        console.log('Login response:', response);
        localStorage.setItem('userData', JSON.stringify(response.data));
        // user-type: 0 - admin 1 - student
        if (response.status === 'success' && response.data.user_type === 0) {
          this.router.navigate(['/admin/lesson']);
        } else if (response.status === 'success' && response.data.user_type === 1) {
          this.router.navigate(['/student/lesson']);
        } else if (response.status === 'success' && response.data.user_type === 2) {
          this.router.navigate(['/admin/lesson']);
        } else {
          this.incorrect = 'Incorrect email or password.';
        }
        this.loading = false;
        // Handle successful login.
      },
      (error) => {
        console.error('Login error:', error);
        if (error.status === 401) {
          // Specifically catch the invalid credentials
          this.incorrect = 'Incorrect email or password.';
        } else {
          // True server errors (500), network timeouts, etc.
          this.incorrect = 'An error occurred on the server. Please try again later.';
        }
        this.loading = false;
      },
    );
  }
}
