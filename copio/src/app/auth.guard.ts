import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Verifica se siamo nel browser e se localStorage è disponibile
  if (typeof window !== 'undefined' && window.localStorage) {
    const token = localStorage.getItem('auth_token'); // Controlla se il token esiste

    if (token) {
      return true; // Se il token esiste, permette l'accesso
    } else {
      router.navigate(['/login']); // Se non c'è token, reindirizza al login
      return false;
    }
  } else {
    // In caso di SSR o contesti non browser, reindirizza direttamente al login
    router.navigate(['/login']);
    return false;
  }
};
