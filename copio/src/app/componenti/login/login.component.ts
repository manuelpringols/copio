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

  constructor(private authService: AuthService, private router: Router) {}

  toggleRegister() {
    this.showRegister = !this.showRegister;
  }

  onSubmit() {
    
      // Login
      this.authService.login(this.email, this.password).subscribe({
        next: (response) => {
          this.authService.saveToken(response.token);
          this.router.navigate(['/']); // Reindirizza alla dashboard
        },
        error: (err) => {
          this.errorMessage = err.error || 'Credenziali errate';
        }
      });
    }
  
}