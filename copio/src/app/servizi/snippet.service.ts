import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { group } from 'node:console';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SnippetService {
  private apiUrlLocal = 'http://localhost:9000/api/snippets'; // URL del tuo backend Spring Boot

  private apiUrl = 'https://copio.online:9000/api/snippets'; // URL del tuo backend Spring >


  constructor(private http: HttpClient) { }

  // Crea un nuovo snippet
  createSnippet(snippet: { title: string, content: string, groupId:any }): Observable<any> {
    return this.http.post(`${this.apiUrl}/create?groupId=${snippet.groupId}`, snippet,);
  }

  // Ottieni tutti gli snippet
  getSnippets(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  // Ottieni gli snippet di un gruppo specifico
  getSnippetsByGroup(groupId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${groupId}`);
  }

  deleteSnippet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getSnippetsByUserId(userId: number,): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`);
  }

  deleteSnippetsByUserId(userId: number, snippetsId: number): Observable<any> {
    const headers = new HttpHeaders({ // Inserisci il token JWT
      'Content-Type': 'application/json'
    });
    return this.http.delete<any>(`${this.apiUrl}/user/${userId}/snippet/${snippetsId}`,{headers});
    

  }


   // Crea un nuovo snippet associato a un utente e a un gruppo
   createSnippetByUser(snippet: { title: string; content: string }, userId: number, groupId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/${userId}/group/${groupId}`, snippet);
  }


  
}
