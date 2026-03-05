import { Component } from '@angular/core';
import { AuthService } from '../service/auth-service';
import { Router } from '@angular/router';

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

  login() {
    // Logic to handle login
    let obj = {
      email: this.email,
      password: this.password,
    };
    // this.authService.login(obj).subscribe((response) => {
    //   console.log('Login response:', response);
    //   localStorage.setItem('userData', JSON.stringify(response.data));
    //   // user-type: 0 - admin 1 - student
    //   if (response.status === 'success' && response.data.user_type === 1) {
    //     this.router.navigate(['/admin/dashboard']);
    //   } else if (response.status === 'success' && response.data.user_type === 1) {
    //     this.router.navigate(['/student/dashboard']);
    //   } else {
    //     this.incorrect = 'Incorrect email or password.';
    //   }
    //   // Handle successful login.
    // });
    this.router.navigate(['/admin/lesson']);
  }
}
