import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonText, IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonButton, IonText, IonItem, IonInput, IonContent, IonTitle, IonToolbar, IonHeader, CommonModule, FormsModule, ReactiveFormsModule],
})
export class LoginPage implements OnInit {
  authForm!: FormGroup;
  isLogin: boolean = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
    console.log(JSON.stringify(this.authForm.value));
  }

  toggleAuthMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit() {
    if (this.authForm.valid) {
      const { email, password } = this.authForm.value;
      if (this.isLogin) {
        this.authService.login(email, password).subscribe({
          next: () => {
            console.log('Login successful');
            // Redirect to a protected route, e.g., '/dashboard'
            this.router.navigate(['/home']);
          },
          error: (error) => {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials.');
          },
        });
      } else {
        this.authService.register(email, password).subscribe({
          next: () => {
            console.log('Registration successful');
            // Switch to login mode after successful registration
            this.isLogin = true;
            alert('Registration successful! Please login.');
          },
          error: (error) => {
            console.error('Registration failed:', error);
            alert('Registration failed. Please try again.');
          },
        });
      }
    }
  }
}
