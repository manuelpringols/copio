import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../servizi/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  email: string = '';
  username: string = '';
  password: string = '';
  errorMessage: string = '';
showRegister: boolean = true;
showLogin: boolean = false;


  constructor(private authService: AuthService, private router:Router) {}

 

  onSubmit() {
    const userData = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.authService.register(userData).subscribe({
      next: (response:string) => {
        console.log('Registrazione avvenuta con successo',response);
        this.router.navigate(["/login"])
      },
      error: (error: any) => {
        console.error('Errore durante la registrazione', error);
        this.errorMessage = 'Registrazione fallita. Riprova.';
      }
    });
  }
}