import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../servizi/auth.service';

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  isMenuOpen = false;

  constructor(private router: Router, private authService: AuthService) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Richiesto dal template — aggiungere logica reale se necessario
  someAction(): void {}

  logout() {
    // FIX: prima rimuoveva 'auth_Token' (T maiuscola) ma il token è salvato
    // come 'auth_token' → removeItem non trovava mai la chiave
    // e l'utente sembrava loggato anche dopo il logout.
    this.authService.logout();
    this.isMenuOpen = false;
    this.router.navigate(['/login']);
  }
}