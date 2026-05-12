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

  return from(authService.getValidAccessToken()).pipe(
    switchMap(token => {
      const authReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

      return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          // FIX: era 403 (Forbidden), ma un token scaduto restituisce 401 (Unauthorized).
          // Con 403 il refresh non partiva mai quando serviva.
          if (error.status === 401 && rememberMe) {
            return authService.refreshToken().pipe(
              switchMap((response: any) => {
                const newToken = response.token;
                const newRefresh = response.refreshToken;

                localStorage.setItem('auth_token', newToken);
                if (newRefresh) localStorage.setItem('refresh_token', newRefresh);

                const retryReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${newToken}` },
                });
                return next(retryReq);
              }),
              catchError((refreshError) => {
                authService.logout();
                return throwError(() => refreshError);
              })
            );
          }
          return throwError(() => error);
        })
      );
    })
  );
};