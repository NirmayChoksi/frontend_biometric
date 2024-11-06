import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { BiometricService } from './services/biometric.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private biometricService: BiometricService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.authenticate();
    });
  }

  ngOnInit() {}

  async authenticate() {
    try {
      const result = await this.biometricService.verifyIdentity();
      console.log('Authentication successful', JSON.stringify(result));
    } catch (error) {
      console.error('Authentication failed', error);
    }
  }
}
