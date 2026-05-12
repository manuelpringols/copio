import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (typeof window === 'undefined' || !window.localStorage) {
    router.navigate(['/login']);
    return false;
  }

  const token = localStorage.getItem('auth_token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  // Controlla anche la scadenza, non solo l'esistenza del token.
  // Prima controllava solo if(token) → un token scaduto passava il guard
  // e tutte le request successive fallivano con 401.
  try {
    const decoded: any = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      router.navigate(['/login']);
      return false;
    }
  } catch {
    router.navigate(['/login']);
    return false;
  }

  return true;
};