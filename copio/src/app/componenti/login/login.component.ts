import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // Variabile per gestire la visualizzazione del modulo Login o Register
  showRegister = false;

  // Metodo che cambia lo stato di showRegister
  toggleRegister() {
    this.showRegister = !this.showRegister;
  }

  onSubmit() {
    // Aggiungi la logica per il login qui
    console.log('Login form submitted');
  }
}