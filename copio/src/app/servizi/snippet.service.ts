import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SnippetService {
  private apiUrl = 'http://localhost:8080/api/snippets'; // URL del tuo backend Spring Boot

  constructor(private http: HttpClient) { }

  // Crea un nuovo snippet
<<<<<<< Updated upstream
  createSnippet(snippet: { title: string, content: string }): Observable<any> {
=======
  createSnippet(snippet : any): Observable<any> {
>>>>>>> Stashed changes
    return this.http.post(this.apiUrl, snippet);
  }

  // Ottieni tutti gli snippet
  getSnippets(): Observable<any> {
<<<<<<< Updated upstream
    return this.http.get(this.apiUrl);
=======
    return this.http.get(`${this.apiUrl}/all`);
>>>>>>> Stashed changes
  }

  // Ottieni gli snippet di un gruppo specifico
  getSnippetsByGroup(groupId: number): Observable<any> {
<<<<<<< Updated upstream
    return this.http.get(`${this.apiUrl}/group/${groupId}`);
=======
    return this.http.get(`${this.apiUrl}/${groupId}`);
>>>>>>> Stashed changes
  }
}
