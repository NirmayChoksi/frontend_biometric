import { Injectable } from '@angular/core';
import {
  AndroidBiometryStrength,
  BiometricAuth,
  BiometryError,
  BiometryErrorType,
} from '@aparajita/capacitor-biometric-auth';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BiometricService {
  verifyIdentity(): Observable<boolean> {
    // Convert the checkBiometry promise to an observable
    return from(BiometricAuth.checkBiometry()).pipe(
      switchMap((biometryResult) => {
        if (biometryResult.isAvailable) {
          // If biometry is available, proceed with authentication
          return from(
            BiometricAuth.authenticate({
              reason: 'Authentication',
              androidTitle: 'Authentication required',
              androidSubtitle: 'Verify Identity',
              androidConfirmationRequired: false,
              androidBiometryStrength: AndroidBiometryStrength.weak,
              allowDeviceCredential: false,
              cancelTitle: 'Cancel',
              iosFallbackTitle: 'Authentication required',
            })
          ).pipe(
            map(() => true), // Authentication successful
            catchError((error) => {
              if (
                error instanceof BiometryError &&
                error.code !== BiometryErrorType.userCancel
              ) {
                alert(error.message);
              }
              return of(false); // Return false if authentication fails
            })
          );
        } else {
          alert('Biometric authentication is not available on this device.');
          return of(false); // Biometric not available
        }
      }),
      catchError((e) => {
        console.error('Error checking availability:', e);
        alert('Authentication failed');
        return of(false); // Return false if there's an error checking availability
      })
    );
  }
}
