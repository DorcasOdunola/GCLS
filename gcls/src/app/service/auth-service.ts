import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(public httpClient: HttpClient) {}

  public baseUrl: string = environment.apiUrl;

  // Add authentication methods here
  public isLoggedIn(): boolean {
    // Logic to check if the user is logged in
    return false; // Placeholder
  }

  public login(obj: any) {
    // Logic to authenticate the user
    return this.httpClient.post<any>(`${this.baseUrl}login`, obj);
  }
}
