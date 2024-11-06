import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { IonHeader, IonButton, IonContent, IonTitle, IonToolbar } from "@ionic/angular/standalone";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonToolbar, IonTitle, IonContent, IonButton, IonHeader,  FormsModule, CommonModule],
})
export class HomePage {
  constructor(private authService: AuthService) {}

  onLogout() {
    this.authService.logout();
  }
}
