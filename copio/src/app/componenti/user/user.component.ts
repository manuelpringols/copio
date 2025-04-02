import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
someAction() {
throw new Error('Method not implemented.');
}
  isMenuOpen = false;

  constructor(private router: Router) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    
    // Animazione aggiuntiva per l'icona
    const icon = document.querySelector('.logout-icon');
    if (icon) {
      if (this.isMenuOpen) {
        icon.classList.add('active');
      } else {
        icon.classList.remove('active');
      }
    }
  }

  logout() {
    localStorage.removeItem('auth_Token'); // Rimuove il token
    this.isMenuOpen = false;
    this.router.navigate(['/login']); // Reindirizza alla pagina di login
  }
}
