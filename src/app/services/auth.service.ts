import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { Observable, from } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private readonly tokenKey = 'token';

  constructor(private http: HttpClient, private router: Router) {}

  // Set token using Capacitor Preferences
  private async setToken(token: string): Promise<void> {
    await Preferences.set({ key: this.tokenKey, value: token });
  }

  // Get token using Capacitor Preferences
  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: this.tokenKey });
    return value;
  }

  // Login method
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(async (response: any) => {
        if (response.token) {
          console.log('response.token:', response.token);
          await this.setToken(response.token);
        }
      })
    );
  }

  // Register method
  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password }).pipe(
      tap((response: any) => {
        console.log('Registration successful:', response);
      })
    );
  }

  // Logout and clear the token
  async logout(): Promise<void> {
    await Preferences.remove({ key: this.tokenKey });
    this.router.navigate(['/login']);
  }

  // Helper function to check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }
}
