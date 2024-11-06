import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { BiometricService } from './services/biometric.service';
import { AuthService } from './services/auth.service';

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
    private biometricService: BiometricService
  ) {
    this.initializeApp();
  }

  // initializeApp() {
  //   this.platform.ready().then(() => {
  //     this.authenticate();
  //   });
  // }

  async initializeApp() {
    this.platform.ready().then(async () => {
      // Check if the token is valid
      const isTokenValid = await this.authService.validateToken();

      if (isTokenValid) {
        console.log('Token is valid');
        this.biometricService.verifyIdentity();
      } else {
        console.log('Token is invalid or expired');
        this.authService.logout();
      }
    });
  }

  ngOnInit() {
    // Additional initialization can be done here if needed.
  }

  async authenticate() {
    try {
      const result = await this.biometricService.verifyIdentity();
    } catch (error) {
      console.error('Authentication failed', error);
    }
  }
}
