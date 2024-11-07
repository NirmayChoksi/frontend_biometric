import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { Observable, from, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { BiometricService } from './biometric.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://backend-biometric.onrender.com/api/auth';
  private readonly tokenKey = 'token';

  constructor(
    private http: HttpClient,
    private router: Router,
    private biometricService: BiometricService
  ) {}

  // Set token using Capacitor Preferences
  private setToken(token: string): Observable<void> {
    return from(Preferences.set({ key: this.tokenKey, value: token }));
  }

  // Get token using Capacitor Preferences
  getToken(): Observable<string | null> {
    return from(Preferences.get({ key: this.tokenKey })).pipe(
      map((result) => result.value)
    );
  }

  // Login method
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        if (response.token) {
          console.log('response.token:', response.token);
          this.setToken(response.token).subscribe(); // Store token in preferences
        }
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        return of(null); // Return observable of null in case of error
      })
    );
  }

  attemptBiometricLogin(): Observable<boolean> {
    return this.biometricService.verifyIdentity().pipe(
      switchMap((isAuthenticated) => {
        if (isAuthenticated) {
          return this.getToken().pipe(
            switchMap((token) => {
              if (token) {
                return this.validateToken();
              }
              return of(false); // No token retrieved
            })
          );
        }
        return of(false); // Biometric authentication failed
      }),
      catchError((error) => {
        console.error('Biometric login failed:', error);
        return of(false); // Return false in case of error
      })
    );
  }

  // Register method
  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password }).pipe(
      tap((response: any) => {
        console.log('Registration successful:', response);
      }),
      catchError((error) => {
        console.error('Registration failed:', error);
        return of(null); // Return observable of null in case of error
      })
    );
  }

  // Logout and clear the token
  logout(): Observable<void> {
    return from(Preferences.remove({ key: this.tokenKey })).pipe(
      switchMap(() => {
        this.router.navigate(['/login']);
        return of(undefined); // Return an observable of void (no value)
      }),
      catchError((error) => {
        console.error('Logout failed:', error);
        return of(undefined); // Return observable of undefined in case of error
      })
    );
  }

  // Helper function to check if user is authenticated
  isAuthenticated(): Observable<boolean> {
    return this.getToken().pipe(
      map((token) => !!token), // Return true if token exists
      catchError(() => of(false)) // Return false in case of error
    );
  }

  validateToken(): Observable<boolean> {
    return this.getToken().pipe(
      switchMap((token) => {
        if (!token) {
          return of(false); // No token found
        }
        return this.http
          .post<{ isValid: boolean }>(`${this.apiUrl}/validate-token`, {
            token,
          })
          .pipe(
            map((response) => response.isValid), // Return boolean based on response
            catchError((error) => {
              console.error('Error validating token:', error);
              return of(false); // Return false if validation fails
            })
          );
      }),
      catchError((error) => {
        console.error('Error validating token:', error);
        return of(false); // Return false if there's an error
      })
    );
  }
}
