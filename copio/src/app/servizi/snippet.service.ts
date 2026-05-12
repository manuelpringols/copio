import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SnippetService {
  // FIX: rimossa apiUrlLocal — era dead code mai usata

    private apiUrlLocal = "http://localhost:9000/api/snippets"; // URL mini-pc dell'API
    //private apiUrl = 'https://copio.online:9000/api/snippets';

  constructor(private http: HttpClient) {}

  // FIX: rimosso createSnippet() con endpoint vecchio /create?groupId=
  // Ora esiste un solo metodo per creare snippet, quello corretto.
  createSnippetByUser(
    snippet: { title: string; content: string },
    userId: number,
    groupId: number
  ): Observable<any> {
    return this.http.post(`${this.apiUrlLocal}/user/${userId}/group/${groupId}`, snippet);
  }

  getSnippets(): Observable<any> {
    return this.http.get(`${this.apiUrlLocal}/all`);
  }

  getSnippetsByGroup(groupId: number): Observable<any> {
    return this.http.get(`${this.apiUrlLocal}/${groupId}`);
  }

  getSnippetsByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlLocal}/user/${userId}`);
  }

  deleteSnippet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlLocal}/${id}`);
  }

  deleteSnippetsByUserId(userId: number, snippetsId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrlLocal}/user/${userId}/snippet/${snippetsId}`);
  }
}