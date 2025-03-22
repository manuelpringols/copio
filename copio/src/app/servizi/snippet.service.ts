import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { group } from 'node:console';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SnippetService {
  private apiUrlLocal = 'http://188.245.185.96:9000/api/snippets'; // URL del tuo backend Spring Boot

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
}
