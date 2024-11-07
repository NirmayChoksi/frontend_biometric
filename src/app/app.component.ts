import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { BiometricService } from './services/biometric.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.authService.attemptBiometricLogin().subscribe(
        (hasValidToken) => {
          if (hasValidToken) {
            console.log('Biometric login successful');
            this.router.navigate(['/home']);
          } else {
            console.log('Token is invalid or expired');
            this.authService.logout().subscribe(() => {
              this.router.navigate(['/login']);
            });
          }
        },
        (error) => {
          console.log('Error during biometric login:', error);
          // Handle error and navigate to login in case of failure
          this.router.navigate(['/login']);
        }
      );
    });
  }
}
