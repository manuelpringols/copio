import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:9000/api/auth'; // Cambia con il tuo backend
  private apiUrlLocal = `https://copio.online:9000/api/pages`; // Modifica il path se necessario

  constructor(private http: HttpClient) {}

  // Registrazione
  register(userData: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // Login
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  // Salvataggio del token in LocalStorage
  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  // Recupero del token
  getToken(): string | null {
    const token = localStorage.getItem('auth_token');
    
    // Controlla se il token è scaduto
    if (token && this.isTokenExpired(token)) {
      this.logout(); // Rimuove il token se scaduto
      return null;
    }
    
    return token;
  }

  // Rimozione del token
  logout(): void {
    localStorage.removeItem('auth_token');
  }

  // Verifica se l'utente è autenticato
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  // **Controllo: Se il token è scaduto, lo rimuove**
  private isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // Tempo attuale in secondi
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Errore nella decodifica del token JWT', error);
      return true; // Se non possiamo decodificarlo, meglio considerarlo scaduto
    }
  }

  // **Ottieni userId dal token attuale**
  getUserIdFromToken(): number | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); // Decodifica il token
        return decodedToken.userId; // Ritorna l'ID utente dal payload
      } catch (error) {
        console.error('Errore nella decodifica del token JWT', error);
        return null;
      }
    }
    return null; // Se non c'è un token
  }

  // **Nuovo metodo: Refresh Token**
  refreshToken(refreshToken: string): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/refresh-token`, { refreshToken });
  }
}
