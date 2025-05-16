import { Component } from '@angular/core';
import { AuthService } from '../../servizi/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  showRegister = false;

  email: string = '';
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  rememberMe: boolean = false; 

  constructor(private authService: AuthService, private router: Router) {}

  toggleRegister() {
    this.showRegister = !this.showRegister;
  }

  onSubmit() {
    this.authService.login(this.email, this.password, this.rememberMe).subscribe({
      next: (response) => {
        // Salvo i token
        this.authService.saveTokens(response.token, response.refreshToken || null);
        
        // Salvo il valore di rememberMe nel localStorage
        localStorage.setItem('rememberMe', this.rememberMe ? 'true' : 'false');
  
        this.router.navigate(['/']); // Reindirizza alla dashboard
      },
      error: (err) => {
        this.errorMessage = err.error || 'Credenziali errate';
      }
    });
  }
  
}