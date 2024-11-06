import { Injectable } from '@angular/core';
import {
  AndroidBiometryStrength,
  BiometricAuth,
  BiometryError,
  BiometryErrorType,
} from '@aparajita/capacitor-biometric-auth';

@Injectable({
  providedIn: 'root',
})
export class BiometricService {
  constructor() {}

  async verifyIdentity() {
    try {
      // Check if biometric authentication is available
      const isAvailable = (await BiometricAuth.checkBiometry()).isAvailable;

      if (isAvailable) {
        // Proceed with biometric authentication
        try {
          const result = await BiometricAuth.authenticate({
            reason: 'Authentication',
            androidTitle: 'Authentication required',
            androidSubtitle: 'Verify Identity',
            androidConfirmationRequired: false,
            androidBiometryStrength: AndroidBiometryStrength.weak,
            allowDeviceCredential: true,
            cancelTitle: 'Cancel',
            iosFallbackTitle: 'Authentication required',
          });
        } catch (error) {
          // error is always an instance of BiometryError.
          if (error instanceof BiometryError) {
            if (error.code !== BiometryErrorType.userCancel) {
              // Display the error.
              alert(error.message);
            }
          }
        }
      } else {
        alert('Biometric authentication is not available on this device.');
      }
    } catch (e) {
      // Handle error when checking availability
      console.error('Error checking availability:', e);
      alert('Authentication failed');
    }
  }
}
