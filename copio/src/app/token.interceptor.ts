import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
} from '@angular/common/http';
import { catchError, switchMap, throwError, from } from 'rxjs';
import { AuthService } from './servizi/auth.service';
import { inject } from '@angular/core';

export const tokenInterceptor: HttpInterceptorFn = (req, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const rememberMe = localStorage.getItem('rememberMe') === 'true';

  // Prima ottengo il token valido (gestisce switch token/refresh e aggiornamenti)
  return from(authService.getValidAccessToken()).pipe(
    switchMap(token => {
      // Clona la request aggiungendo header Authorization solo se c'è un token valido
      const authReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

      return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          // Se ricevo 401 e rememberMe è attivo, provo a fare refresh token e retry
          if (error.status === 403 && rememberMe) {
            return authService.refreshToken().pipe(
              switchMap((response: any) => {
                const newToken = response.token;
                const newRefresh = response.refreshToken;

                // Salvo i nuovi token in localStorage
                localStorage.setItem('auth_token', newToken);
                if (newRefresh) {
                  localStorage.setItem('refresh_token', newRefresh);
                }

                // Rifaccio la richiesta originale con il nuovo token
                const retryReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${newToken}` },
                });

                return next(retryReq);
              }),
              catchError((refreshError) => {
                // Se anche il refresh fallisce, logout
                authService.logout();
                return throwError(() => refreshError);
              })
            );
          }
          // Propaga altri errori
          return throwError(() => error);
        })
      );
    })
  );
};
