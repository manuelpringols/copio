import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  @Output() switchToLogin = new EventEmitter<void>();

showRegister: boolean = false;

  // Metodo che emette l'evento
 
onSubmit() {
throw new Error('Method not implemented.');
}

}
