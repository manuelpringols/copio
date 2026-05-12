import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // FIX: rimossa apiUrlLocal — era dead code, mai usata
  private apiUrl = 'http://localhost:9000/api/auth';

  constructor(private http: HttpClient) {}

  register(userData: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(email: string, password: string, rememberMe: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password, rememberMe });
  }

  saveTokens(accessToken: string, refreshToken: string | null): void {
    localStorage.setItem('auth_token', accessToken);
    if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp < Math.floor(Date.now() / 1000);
    } catch {
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

  refreshToken(tokenToRefresh?: string): Observable<{ token: string; refreshToken?: string }> {
    const refresh = tokenToRefresh ?? localStorage.getItem('refresh_token');

    if (!refresh) return throwError(() => new Error('No refresh token available'));

    // FIX: era `${this.apiUrl}/auth/refresh` → '/api/auth/auth/refresh' (doppio auth).
    // Il path corretto è semplicemente /refresh.
    return this.http.post<{ token: string; refreshToken?: string }>(
      `${this.apiUrl}/refresh`,
      { refreshToken: refresh }
    ).pipe(
      tap(res => this.saveTokens(res.token, res.refreshToken || null))
    );
  }

  getValidAccessToken(): Observable<string | null> {
    const accessToken  = localStorage.getItem('auth_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const rememberMe   = localStorage.getItem('rememberMe') === 'true';
    const now          = Date.now();

    const expired = (token: string | null) => !token || this.isTokenExpired(token);

    if (accessToken && !expired(accessToken)) {
      if (refreshToken) {
        const refreshExp = this.getTokenExpirationDate(refreshToken);
        if (refreshExp && (refreshExp.getTime() - now) < 10 * 60 * 1000) {
          return this.refreshToken(accessToken).pipe(
            switchMap(res => of(res.token)),
            catchError(() => { this.logout(); return of(null); })
          );
        }
      }
      return of(accessToken);
    }

    if (expired(accessToken)) {
      if (refreshToken && !expired(refreshToken)) {
        localStorage.setItem('auth_token', refreshToken);
        localStorage.removeItem('refresh_token');
        return of(refreshToken);
      }
      if (!refreshToken && accessToken && rememberMe) {
        return this.refreshToken().pipe(
          switchMap(res => of(res.token)),
          catchError(() => { this.logout(); return of(null); })
        );
      }
      this.logout();
      return of(null);
    }

    return of(null);
  }

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