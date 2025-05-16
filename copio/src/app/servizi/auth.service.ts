import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError, from } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrlLocal = 'http://localhost:9000/api/auth'; // Cambia con il tuo backend

  private apiUrl = 'https://copio.online:9000/api/auth'; // Cambia con il tuo backend


  constructor(private http: HttpClient) {}

  // --- Metodi base ---

  register(userData: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(email: string, password: string, rememberMe: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password, rememberMe });
  }

  saveTokens(accessToken: string, refreshToken: string | null): void {
    localStorage.setItem('auth_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }

  // --- Decodifica e controllo scadenza token ---

  private isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // in secondi
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Errore nella decodifica del token JWT', error);
      return true;
    }
  }

  private getTokenExpirationDate(token: string): Date | null {
    try {
      const decoded: any = jwtDecode(token);
      if (!decoded.exp) return null;
      return new Date(decoded.exp * 1000);
    } catch {
      return null;
    }
  }

  // --- Refresh token chiamata al backend ---

  refreshToken(tokenToRefresh?: string): Observable<{ token: string; refreshToken?: string }> {
    // Se non passo tokenToRefresh, prendo quello da localStorage
    const refresh = tokenToRefresh ?? localStorage.getItem('refresh_token');
  
    if (!refresh) {
      return throwError(() => new Error('No refresh token available for refresh'));
    }
  
    return this.http.post<{ token: string; refreshToken?: string }>(
      `${this.apiUrl}/auth/refresh`,
      { refreshToken: refresh }
    ).pipe(
      tap(res => {
        this.saveTokens(res.token, res.refreshToken || null);
      })
    );
  }

  // --- NUOVO metodo principale per ottenere un token valido ---

  /**
   * Restituisce un Observable con il token access valido.
   * Se l'access token è scaduto ma il refresh token è valido,
   * usa il refresh token come access token.
   * Se il refresh token sta per scadere, chiama il backend per ottenere nuovi token.
   */
  getValidAccessToken(): Observable<string | null> {
    const accessToken = localStorage.getItem('auth_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    const now = Date.now();
  
    const expired = (token: string | null) => !token || this.isTokenExpired(token);
  
    // Caso accessToken valido
    if (accessToken && !expired(accessToken)) {
      if (refreshToken) {
        const refreshExp = this.getTokenExpirationDate(refreshToken);
        if (refreshExp && (refreshExp.getTime() - now) < 10 * 60 * 1000) {
          // refreshToken sta per scadere → rinnovo token
          return this.refreshToken(accessToken).pipe(
            switchMap(res => of(res.token)),
            catchError(() => {
              this.logout();
              return of(null);
            })
          );
        }
      }
      return of(accessToken);
    }
  
    // Caso accessToken scaduto
    if (expired(accessToken)) {
      // Se refreshToken valido, promuovilo ad accessToken
      if (refreshToken && !expired(refreshToken)) {
        localStorage.setItem('auth_token', refreshToken);
        localStorage.removeItem('refresh_token');
        return of(refreshToken);
      }
  
      // QUI LA MODIFICA:
      // Se NON ho refreshToken ma ho accessToken (promosso)
      // E rememberMe è attivo
      if (!refreshToken && accessToken && rememberMe) {
        // Qui chiama il backend per rinnovare il token (refreshToken)
        return this.refreshToken().pipe(
          switchMap(res => of(res.token)),
          catchError(() => {
            this.logout();
            return of(null);
          })
        );
      }
  
      // Altrimenti logout
      this.logout();
      return of(null);
    }
  
    return of(null);
  }
  // --- Metodo helper per id utente ---

  getUserIdFromToken(): number | null {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.userId ?? null;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    return token !== null && !this.isTokenExpired(token);
  }
}
