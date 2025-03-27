import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('auth_token'); // Controlla se il token esiste

  if (token) {
    return true; // Se il token esiste, permette l'accesso
  } else {
    router.navigate(['/login']); // Se non c'è token, reindirizza al login
    return false;
  }
};