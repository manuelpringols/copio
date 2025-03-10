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
  createSnippet(snippet: { title: string, content: string }): Observable<any> {
    return this.http.post(this.apiUrl, snippet);
  }

  // Ottieni tutti gli snippet
  getSnippets(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  // Ottieni gli snippet di un gruppo specifico
  getSnippetsByGroup(groupId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${groupId}`);
  }
}
